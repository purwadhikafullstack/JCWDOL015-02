import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OutletAssignmentController {
  updateOutletAssignment(
    arg0: string,
    verifyToken: (
      req: Request,
      res: Response,
      next: import('express').NextFunction,
    ) => void,
    verifySuperAdmin: (
      req: Request,
      res: Response,
      next: import('express').NextFunction,
    ) => void | Response<any, Record<string, any>>,
    updateOutletAssignment: any,
  ) {
    throw new Error('Method not implemented.');
  }
  private static calculateTotalPages(
    totalItems: number,
    itemsPerPage: number,
  ): number {
    return Math.ceil(totalItems / itemsPerPage);
  }
  async assignUserToOutlet(req: Request, res: Response) {
    const { admins, drivers, outletId, workers } = req.body;

    // Validasi input
    if (!outletId || (!admins && !drivers && !workers)) {
      return res.status(400).json({ message: 'Lengkapi Inputan!' });
    }

    try {
      // Kumpulkan semua operasi pembaruan dalam array
      const updateOperations: any[] = [];
      // Langkah pertama: Reset outletId untuk semua user yang terhubung ke outletId tersebut
      updateOperations.push(
        prisma.user.updateMany({
          where: {
            outletId: outletId, // Temukan semua pengguna yang memiliki outletId ini
          },
          data: { outletId: null }, // Set outletId menjadi null
        }),
      );
      if (outletId) {
        updateOperations.push(
          prisma.outlet.update({
            where: { id: Number(outletId) },
            data: { isAssign: 'Yes' },
          }),
        );
      }
      // Operasi pembaruan untuk setiap admin
      if (admins) {
        updateOperations.push(
          prisma.user.update({
            where: { id: Number(admins) },
            data: { outletId: outletId },
          }),
        );
      }

      // Operasi pembaruan untuk setiap driver
      if (Array.isArray(drivers)) {
        drivers.forEach((driverId: number) => {
          updateOperations.push(
            prisma.user.update({
              where: { id: driverId },
              data: { outletId: outletId },
            }),
          );
        });
      }

      // Operasi pembaruan untuk setiap worker
      if (Array.isArray(workers)) {
        workers.forEach((workerId: number) => {
          updateOperations.push(
            prisma.user.update({
              where: { id: workerId },
              data: { outletId: outletId },
            }),
          );
        });
      }

      // Eksekusi semua operasi dalam satu transaksi
      await prisma.$transaction(updateOperations);

      return res.status(200).json({
        message: `Users have been successfully assigned to outlet ${outletId}.`,
      });
    } catch (error) {
      console.error('Error assigning users to outlet:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAssignById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
      // Cari outlet berdasarkan ID
      const outlet = await prisma.outlet.findUnique({ where: { id } });
      if (!outlet) {
        return res.status(404).json({ error: 'Outlet not found' });
      }

      // Cari user berdasarkan ID
      const user = await prisma.user.findMany({ where: { outletId: id } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Gabungkan hasil outlet dan user
      return res.status(200).json({ outlet, user });
    } catch (error) {
      console.error('Error fetching outlet or user:', error);
      return res.status(500).json({ error: 'Error fetching outlet or user' });
    }
  }

  async getAllOutletAssign(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

      // Dapatkan outlet dan hitung totalnya
      const [outlets, totalCount] = await Promise.all([
        prisma.outlet.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.outlet.count(),
      ]);

      if (!outlets.length) {
        return res.status(404).json({ error: 'No outlets found' });
      }

      // Dapatkan total halaman
      const totalPages = OutletAssignmentController.calculateTotalPages(
        totalCount,
        pageSize,
      );

      // Cari user berdasarkan outletId
      const outletUserAssignments = await Promise.all(
        outlets.map(async (outlet) => {
          const users = await prisma.user.findMany({
            where: { outletId: outlet.id },
            select: { id: true, username: true, role: true }, // Pilih atribut yang diinginkan
          });

          // Kelompokkan user berdasarkan role
          const groupedUsers = {
            admins: users.filter((user) => user.role === 'admin'),
            drivers: users.filter((user) => user.role === 'driver'),
            workers: users.filter((user) => user.role === 'worker'),
          };

          return {
            outlet,
            users: groupedUsers,
          };
        }),
      );

      return res.status(200).json({
        data: outletUserAssignments,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.error('Error fetching outlets:', error);
      return res.status(500).json({ error: 'Error fetching outlets' });
    }
  }
}
