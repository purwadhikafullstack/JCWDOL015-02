// src/controllers/outlet.controller.ts
import { Request, Response } from 'express';
import Outlet, { OutletDocument } from '../models/outlet.model';

export class OutletController {
  async createOutlet(req: Request, res: Response): Promise<Response> {
    const { name, location, adminId } = req.body;
    try {
      const outlet = new Outlet({ name, location, adminId });
      await outlet.save();
      return res.status(201).json(outlet);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating outlet' });
    }
  }

  async getOutlets(req: Request, res: Response): Promise<Response> {
    try {
      const outlets = await Outlet.find();
      return res.status(200).json(outlets);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching outlets' });
    }
  }

  async updateOutlet(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, location } = req.body;
    try {
      const outlet = await Outlet.findByIdAndUpdate(
        id,
        { name, location },
        { new: true },
      );
      return res.status(200).json(outlet);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating outlet' });
    }
  }

  async deleteOutlet(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      await Outlet.findByIdAndDelete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting outlet' });
    }
  }
}

export const outletController = new OutletController();
