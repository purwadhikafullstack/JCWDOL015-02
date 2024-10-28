// /controllers/order.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderService } from '../services/order.service';

const prisma = new PrismaClient();

export const OrderController = {
  getAllOrders: async (req: Request, res: Response) => {
    const outletId = req.query.outletId as string;
    try {
      const orders = await OrderService.getOrders(outletId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    }
  },
  getOrder: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve order' });
    }
  },
  createOrder: async (req: Request, res: Response) => {
    const {
      userId,
      addressId,
      orderPackage,
      totalWeight,
      totalPrice,
      status,
      pickupSchedule,
    } = req.body;

    try {
      const newOrder = await OrderService.createOrder({
        userId,
        addressId,
        package: orderPackage,
        totalWeight,
        totalPrice,
        status,
        pickupSchedule,
      });
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create order' });
    }
  },
  confirmOrder: async (req: Request, res: Response) => {
    const { orderId, confirm } = req.body;
    try {
      const updatedOrder = await OrderService.confirmOrder(orderId, confirm);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to confirm order' });
    }
  },
};
