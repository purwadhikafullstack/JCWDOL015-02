import { Request, Response } from 'express';
import prisma from '@/prisma';

export class WorkerJobHistoryController {
  // Get all WorkerJobHistory records
  async getAllWorkerJobHistory(req: Request, res: Response) {
    try {
      const jobHistories = await prisma.workerJobHistory.findMany({
        include: {
          worker: true,
          order: true,
          pickupDeliveryRequest: true,
        },
      });

      return res.status(200).send(jobHistories);
    } catch (error) {
      console.error('Error fetching worker job histories:', error);
      return res.status(500).send({ error: 'Failed to fetch worker job histories' });
    }
  }

  // Get a specific WorkerJobHistory record by ID
  async getWorkerJobHistoryById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const jobHistory = await prisma.workerJobHistory.findUnique({
        where: { id: Number(id) },
        include: {
          worker: true,
          order: true,
          pickupDeliveryRequest: true,
        },
      });

      if (!jobHistory) {
        return res.status(404).send({ error: 'WorkerJobHistory not found' });
      }

      return res.status(200).send(jobHistory);
    } catch (error) {
      console.error('Error fetching worker job history by ID:', error);
      return res.status(500).send({ error: 'Failed to fetch worker job history' });
    }
  }
  async getWorkerJobHistoryByOrderId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const jobHistory = await prisma.workerJobHistory.findMany({
        where: { orderId: Number(id) },
        include: {
          order: true,
        },
      });

      if (!jobHistory) {
        return res.status(404).send({ error: 'WorkerJobHistory not found' });
      }

      return res.status(200).send(jobHistory);
    } catch (error) {
      console.error('Error fetching worker job history by ID:', error);
      return res.status(500).send({ error: 'Failed to fetch worker job history' });
    }
  }

  // Create a new WorkerJobHistory record
  async createWorkerJobHistory(req: Request, res: Response) {
    const { workerId, orderId, station, pickupDelivery } = req.body;

    try {
      const newJobHistory = await prisma.workerJobHistory.create({
        data: {
          workerId,
          orderId,
          station,
          pickupDelivery,
        },
      });

      return res.status(201).send(newJobHistory);
    } catch (error) {
      console.error('Error creating worker job history:', error);
      return res.status(500).send({ error: 'Failed to create worker job history' });
    }
  }

  // Update a WorkerJobHistory record by ID
  async updateWorkerJobHistory(req: Request, res: Response) {
    const { id } = req.params;
    const { workerId, orderId, station, pickupDelivery } = req.body;

    try {
      const updatedJobHistory = await prisma.workerJobHistory.update({
        where: { id: Number(id) },
        data: {
          workerId,
          orderId,
          station,
          pickupDelivery,
        },
      });

      return res.status(200).send(updatedJobHistory);
    } catch (error:any) {
      console.error('Error updating worker job history:', error);

      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'WorkerJobHistory not found' });
      }

      return res.status(500).send({ error: 'Failed to update worker job history' });
    }
  }

  // Delete a WorkerJobHistory record by ID
  async deleteWorkerJobHistory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.workerJobHistory.delete({
        where: { id: Number(id) },
      });

      return res.status(200).send({ message: 'WorkerJobHistory deleted successfully' });
    } catch (error:any) {
      console.error('Error deleting worker job history:', error);

      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'WorkerJobHistory not found' });
      }

      return res.status(500).send({ error: 'Failed to delete worker job history' });
    }
  }
}
