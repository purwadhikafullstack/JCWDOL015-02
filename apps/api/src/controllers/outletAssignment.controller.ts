import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OutletAssignmentController {
  async assignUserToOutlet(req: Request, res: Response) {
    const { admins, drivers, outletId, workers } = req.body;

    // Validasi input
    if (!outletId || (!admins && !drivers && !workers)) {
      return res.status(400).json({ message: 'Lengkapi Inputan!' });
    }

    try {
      // Kumpulkan semua operasi pembaruan dalam array
      const updateOperations: any[] = [];

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
}
