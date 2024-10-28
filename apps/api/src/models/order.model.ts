// /models/order.model.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const Order = prisma.order;
export const OrderItem = prisma.orderItem;

// Model relations and enums for handling order statuses
export const OrderStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
} as const;

export type OrderStatusType = keyof typeof OrderStatus;
