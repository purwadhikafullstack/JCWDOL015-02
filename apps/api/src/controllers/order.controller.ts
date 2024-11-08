import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderController {
  async getAllOrders(req: Request, res: Response): Promise<Response> {
    const outletId = req.query.outletId as string;
    try {
      const orders = await prisma.order.findMany({
        where: {
          outletId: parseInt(outletId),
        },
        include: {
          items: {
            select: {
              id: true,
              quantity: true,
              laundry_type: true,
              price: true,
            },
          },
          outlet: true,
        },
      });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve orders' });
    }
  }

  async getOrder(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve order' });
    }
  }

  async createOrder(req: Request, res: Response): Promise<Response> {
    const {
      userId,
      addressId,
      orderPackage,
      totalWeight,
      totalPrice,
      pickupSchedule,
      outletId,
      workerId,
    } = req.body;

    try {
      const newOrder = await prisma.order.create({
        data: {
          userId,
          addressId,
          package: orderPackage,
          totalWeight,
          totalPrice,
          status: OrderStatus.waiting_for_pickup,
          pickupSchedule,
          outletId: parseInt(outletId),
          workerId: parseInt(workerId),
        },
        include: {
          items: {
            select: {
              id: true,
              quantity: true,
              laundry_type: true,
              price: true,
            },
          },
          outlet: true,
        },
      });
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to create order' });
    }
  }

  async confirmOrder(req: Request, res: Response): Promise<Response> {
    const { orderId, confirm } = req.body;
    try {
      const status = confirm
        ? OrderStatus.delivered_to_customer
        : OrderStatus.ready_for_delivery;
      const updatedOrder = await prisma.order.updateMany({
        where: { id: parseInt(orderId) },
        data: { status },
      });
      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to confirm order' });
    }
  }
}

export const orderController = new OrderController();
