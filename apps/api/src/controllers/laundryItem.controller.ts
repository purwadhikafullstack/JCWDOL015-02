import { Request, Response } from 'express';
import LaundryItem from '../models/laundryItem.model';

export const createLaundryItem = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  try {
    const laundryItem = new LaundryItem({ name, price });
    await laundryItem.save();
    res.status(201).json(laundryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating laundry item' });
  }
};

export const getLaundryItems = async (req: Request, res: Response) => {
  try {
    const laundryItems = await LaundryItem.find();
    res.status(200).json(laundryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching laundry items' });
  }
};

export const updateLaundryItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const laundryItem = await LaundryItem.findByIdAndUpdate(
      id,
      { name, price },
      { new: true },
    );
    res.status(200).json(laundryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating laundry item' });
  }
};

export const deleteLaundryItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await LaundryItem.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting laundry item' });
  }
};
