import { Request, Response } from 'express';
import Outlet from '../models/outlet.model';

export const createOutlet = async (req: Request, res: Response) => {
  const { name, location, adminId } = req.body;
  try {
    const outlet = new Outlet({ name, location, adminId });
    await outlet.save();
    res.status(201).json(outlet);
  } catch (error) {
    res.status(500).json({ message: 'Error creating outlet' });
  }
};

export const getOutlets = async (req: Request, res: Response) => {
  try {
    const outlets = await Outlet.find();
    res.status(200).json(outlets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching outlets' });
  }
};

export const updateOutlet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, location } = req.body;
  try {
    const outlet = await Outlet.findByIdAndUpdate(
      id,
      { name, location },
      { new: true },
    );
    res.status(200).json(outlet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating outlet' });
  }
};

export const deleteOutlet = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Outlet.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting outlet' });
  }
};
