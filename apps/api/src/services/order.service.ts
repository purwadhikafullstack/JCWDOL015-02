// /services/order.service.ts
import { PrismaClient, OrderStatus } from '@prisma/client'; // Import enum OrderStatus dari Prisma Client

const prisma = new PrismaClient();

export const OrderService = {
  getOrders: async (outletId: string) => {
    return await prisma.order.findMany({
      where: { outletId: parseInt(outletId) },
      include: { items: true },
    });
  },
  createOrder: async (data: any) => {
    return await prisma.order.create({
      data: {
        ...data,
        status: OrderStatus.waiting_for_pickup, // Sesuaikan nilai dengan enum di Prisma
      },
      include: { items: true },
    });
  },
  confirmOrder: async (orderId: string, confirm: boolean) => {
    const status = confirm
      ? OrderStatus.delivered_to_customer
      : OrderStatus.ready_for_delivery; // Gunakan enum dari Prisma
    return await prisma.order.updateMany({
      where: { id: parseInt(orderId) },
      data: { status },
    });
  },
};
