import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Order, OrderStatus, WorkerRoles } from '@prisma/client';
import { findNearestOutlet } from '@/helpers/haversine';
import axios from 'axios';

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
    const { id } = req.params;

        try {
            const order = await prisma.order.findUnique({
                where: { id: Number(id) },
            });

            if (!order) {
                return res.status(404).send({ error: 'order not found' });
            }

            return res.status(200).send(order);
        } catch (error) {
            return res.status(500).send({ error: 'Error fetching order' });
        }
  }


  async createOrder(req: Request, res: Response) {
    try {
      const { userId, addressId, pickupSchedule } = req.body;
      const user = await prisma.user.findFirst({ where: { id: userId } });
      if (!user) throw "User not found!";
      
      const userAddress = await prisma.address.findFirst({ where: { id: addressId } });
      if (!userAddress) throw "Address not found!";
      
      const { nearestOutlet, distance } = await findNearestOutlet(addressId);
      if (!nearestOutlet?.outletId) throw "Outlet not found!";
      
      const newOrder = await prisma.order.create({
        data: {
          userId,
          addressId,
          outletId: nearestOutlet.outletId,
          pickupSchedule: new Date(pickupSchedule),
        }
      });
      
      const driver = await prisma.outletWorker.findFirst({
        where: { outletId: newOrder.outletId, role: "driver" }
      });
  
      if (driver) {
        await axios.post(`${process.env.BACKEND_URL}/api/pdr`, {
          orderId: newOrder.id,
          distance: distance,
          driverId: driver.id,
          fromAddressId: addressId,
          toAddressId: nearestOutlet.id,
          requestType: "pickup",
          status: "Wait to pick up"
        });
      }
  
      res.status(200).send({
        status: 'ok',
        message: `Successful Pickup Request. Outlet ${newOrder.outletId} will take your order, and driver ${driver?.name} will pick up your laundry. Distance: ${distance} km`,
        data: new Date(pickupSchedule)
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).send({ status: "error", message: error.message });
      }
      res.status(400).send({ status: "error", message: error });
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

    if (!orderId) {
      return res.status(400).send({ error: 'Order ID is required' });
    }

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

      return res.status(200).send(updatedOrder);
    } catch (error:any) {
      console.error('Error updating order:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Order not found' });
      }

      return res.status(500).send({ error: 'Error updating order' });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const { status, userId} = req.body;
  
    if (!orderId) {
      return res.status(400).send({ error: 'Order ID is required' });
    }
  
    if (!status) {
      return res.status(400).send({ error: 'Order status is required' });
    }
  
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: Number(orderId) },
        data: {
          status: status as OrderStatus,
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          title: `Order ${orderId} Status Updated`,
          message: `The status of your order has been updated to ${status}.`,
        },
      });
  
      return res.status(200).send({
        status: 'ok',
        message: 'Order status updated successfully and notification sent',
        data: updatedOrder,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
  
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Order not found' });
      }
  
      return res.status(500).send({ error: 'Error updating order status' });
    }
  }
  

  async deleteOrder(req: Request, res: Response) {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).send({ error: 'Order ID is required' });
    }

    try {
      const deletedOrder = await prisma.order.delete({
        where: { id: Number(orderId) },
      });

      return res.status(200).send({ message: 'Order deleted successfully', deletedOrder });
    } catch (error:any) {
      console.error('Error deleting order:', error);

      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Order not found' });
      }

      return res.status(500).send({ error: 'Error deleting order' });
    }
  }
}
