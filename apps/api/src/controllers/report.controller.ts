import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getReports = async (req: Request, res: Response) => {
  const { outlet, startDate, endDate } = req.query;

  try {
    const salesReport = await prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        createdAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
    });

    const employeePerformanceReport = await prisma.order.groupBy({
      by: ['workerId'],
      _count: {
        _all: true,
      },
      where: {
        createdAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
    });

    res.json({ salesReport, employeePerformanceReport });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
};

export { getReports };
