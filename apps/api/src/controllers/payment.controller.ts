import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  const {
    userId,
    outletId,
    user,
    addressId,
    orderPackage,
    totalWeight,
    totalPrice,
    status,
    pickupSchedule,
  } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        userId,
        outletId,
        user: { connect: { id: user } },
        address: { connect: { id: addressId } },
        addressId,
        package: orderPackage,
        totalWeight,
        totalPrice,
        status,
        pickupSchedule,
      },
    });
    res.status(201).json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getOrder = async (req: Request, res: Response) => {
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
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
