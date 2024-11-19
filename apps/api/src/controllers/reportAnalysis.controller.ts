import { Request, Response } from 'express';
import prisma from '@/prisma';

export class ReportAnalysisController {
  // Laporan income per hari / bulan / tahun
  async getSalesReport(req: Request, res: Response) {
    const { outletId, startDate, endDate, period } = req.query;

    try {
      // Ambil data order dengan filter outlet dan rentang waktu
      const orders = await prisma.order.findMany({
        where: {
          outletId: outletId ? Number(outletId) : undefined,
          createdAt: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        select: {
          createdAt: true,
          totalPrice: true,
        },
      });

      // Kelompokkan data berdasarkan periode
      const salesReport = orders.reduce((acc: any, order) => {
        const date = new Date(order.createdAt);
        let key: string;

        if (period === 'day') {
          key = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        } else if (period === 'month') {
          key = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM
        } else {
          key = `${date.getFullYear()}`; // Format: YYYY
        }

        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += order.totalPrice;
        return acc;
      }, {});

      return res.status(200).send(salesReport);
    } catch (error) {
      console.error('Error fetching sales report:', error);
      return res.status(500).send({ error: 'Failed to fetch sales report' });
    }
  }

  // Laporan performa karyawan (total pekerjaan per karyawan)
  async getEmployeePerformanceReport(req: Request, res: Response) {
    const { outletId, startDate, endDate } = req.query;

    try {
      const performanceReport = await prisma.workerJobHistory.groupBy({
        by: ['workerId'],
        where: {
          worker: {
            outletId: outletId ? Number(outletId) : undefined,
          },
          createdAt: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        _count: {
          id: true, // Total pekerjaan per worker
        },
      });

      return res.status(200).send(performanceReport);
    } catch (error) {
      console.error('Error fetching employee performance report:', error);
      return res
        .status(500)
        .send({ error: 'Failed to fetch employee performance report' });
    }
  }
}
