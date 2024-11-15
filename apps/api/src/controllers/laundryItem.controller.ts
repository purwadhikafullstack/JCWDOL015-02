import { Request, Response } from 'express';
import prisma from '@/prisma';

export const createLaundryItem = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  try {
    const newLaundry = await prisma.laundryItem.create({
      data: {
        name,
        description,
        price,
      },
    });
    res.status(201).json(newLaundry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating laundry item' });
  }
};

export const getLaundryItems = async (req: Request, res: Response) => {
  try {
    const laundryitem = await prisma.laundryItem.findMany();
    return res.status(200).json(laundryitem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching laundry items' });
  }
};

export const updateLaundryItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const newLaundry = await prisma.laundryItem.update({
      where: { id: +id },
      data: { name, description, price },
    });
    res.status(200).json(newLaundry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating laundry item' });
  }
};

export const deleteLaundryItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const delLaundry = await prisma.laundryItem.delete({
      where: { id: Number(id) },
    });
    res.status(200).send({
      status: 'ok',
      message: 'delete laundryItem success !',
      data: delLaundry,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting laundry item' });
  }
};
