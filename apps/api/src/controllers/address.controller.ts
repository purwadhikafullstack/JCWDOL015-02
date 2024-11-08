import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAddress = async (req: Request, res: Response) => {
  const {
    userId,
    outletId,
    address,
    city,
    state,
    postalCode,
    country,
    isPrimary,
    latitude,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    longitude,
  } = req.body;

  try {
    const newAddress = await prisma.address.create({
      data: {
        userId,
        outletId,
        address,
        city,
        state,
        postalCode,
        country,
        latitude,
        longitude,
      },
    });
    res.status(201).json(newAddress);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getAddress = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const address = await prisma.address.findUnique({
      where: { id: Number(id) },
    });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.status(200).json(address);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const address = await prisma.address.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'Address deleted successfully', address });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: 'Address not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
