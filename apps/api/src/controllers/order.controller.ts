import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Order, OrderStatus } from '@prisma/client';
import { findNearestOutlet } from '@/helpers/haversine';

export class OrderController {
  async getAllOrder(req: Request, res: Response) {
    try {
      const orders: Order[] = await prisma.order.findMany();
      if (!orders.length) {
        return res.status(404).send({ error: 'No orders found' });
      }
      return res.status(200).send(orders);
    } catch (error) {
      return res.status(500).send({ error: 'Error fetching orders' });
    }
  }

  async getOrderById(req: Request, res: Response) {
    const { orderId } = req.params;
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
      });
      if (!order) {
        return res.status(404).send({ error: 'Order not found' });
      }
      return res.status(200).send({
        status: 'ok',
        message: 'Get Order By Id Successfully',
        data: order,
      });
    } catch (error) {
      return res.status(500).send({ error: 'Error retrieving order' });
    }
  }

  async searchOrder(req: Request, res: Response) {
    const { date, orderId } = req.body;
    try {
      if (!date && !orderId) {
        return res.status(400).send({ error: 'Date or orderId is required!' });
      }
      if (date) {
        const startOfDay = new Date(date).setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date).setUTCHours(23, 59, 59, 999);
        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: new Date(startOfDay).toISOString(),
              lte: new Date(endOfDay).toISOString(),
            },
          },
        });
        return res.status(200).send({
          status: 'ok',
          message: 'Get Order By Date Successfully',
          data: orders,
        });
      }
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: Number(orderId) },
        });
        return res.status(200).send({
          status: 'ok',
          message: 'Get Order By Id Successfully',
          data: order ? [order] : [],
        });
      }
    } catch (error) {
      return res.status(500).send({ error: 'Error searching orders' });
    }
  }

  async getAllOrderByUserId(req: Request, res: Response) {
    const { Id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    try {
      const orders = await prisma.order.findMany({
        where: { userId: Number(Id) },
        orderBy: { createdAt: 'desc' },
      });
      const paginatedOrders = orders.slice(startIndex, startIndex + limit);
      res.status(200).send({
        status: 'ok',
        message: 'Get All Orders By User Id Successfully',
        data: paginatedOrders,
        currentPage: page,
        totalPages: Math.ceil(orders.length / limit),
      });
    } catch (error) {
      return res.status(500).send({ error: 'Error fetching user orders' });
    }
  }

  async createOrder(req: Request, res: Response) {
    const { userId, addressId, pickupSchedule } = req.body;

    try {
      const user = await prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        return res.status(404).send({ error: 'User not found!' });
      }

      const userAddress = await prisma.address.findFirst({
        where: { id: addressId },
      });
      if (!userAddress) {
        return res.status(404).send({ error: 'Address not found!' });
      }

      const { nearestOutlet } = await findNearestOutlet(addressId);
      if (!nearestOutlet?.outletId) {
        return res.status(404).send({ error: 'Outlet not found!' });
      }

      const newOrder = await prisma.order.create({
        data: {
          userId,
          addressId,
          outletId: nearestOutlet.outletId,
          pickupSchedule: new Date(pickupSchedule),
        },
      });

      return res.status(201).send({
        status: 'ok',
        message: 'Order created successfully',
        data: newOrder,
      });
    } catch (error) {
      return res.status(500).send({ error: 'Error creating order' });
    }
  }

  async updateOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const {
      addressId,
      packageName,
      pickupSchedule,
      totalWeight,
      totalItems,
      totalPrice,
      paymentStatus,
      status,
    } = req.body;

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: Number(orderId) },
        data: {
          addressId,
          package: packageName,
          pickupSchedule: pickupSchedule ? new Date(pickupSchedule) : undefined,
          totalWeight,
          totalItems,
          totalPrice,
          paymentStatus,
          status: status as OrderStatus,
        },
        include: {
          user: true,
          address: true,
          outlet: true,
        },
      });
      return res.status(200).send({
        status: 'ok',
        message: 'Order updated successfully',
        data: updatedOrder,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Order not found' });
      }
      return res.status(500).send({ error: 'Error updating order' });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
      const deletedOrder = await prisma.order.delete({
        where: { id: Number(orderId) },
      });
      return res.status(200).send({
        message: 'Order deleted successfully',
        data: deletedOrder,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Order not found' });
      }
      return res.status(500).send({ error: 'Error deleting order' });
    }
  }
}
