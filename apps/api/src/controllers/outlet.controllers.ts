import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Outlet } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class OutletController {


  async getAllOutlet(req: Request, res: Response): Promise<Response> {
    try {
      const outlets: Outlet[] = await prisma.outlet.findMany();

      if (!outlets.length) {
        return res.status(404).send({ error: 'No outlets found' });
      }

      return res.status(200).send(outlets);
    } catch (error) {
      return res.status(500).send({ error: 'Error fetching outlets' });
    }
  }

  async getOutletById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const outlet = await prisma.outlet.findUnique({
        where: { id: Number(id) },
      });

      if (!outlet) {
        return res.status(404).send({ error: 'Outlet not found' });
      }

      return res.status(200).send(outlet);
    } catch (error) {
      return res.status(500).send({ error: 'Error fetching outlet' });
    }
  }

  async createOutlet(req: Request, res: Response): Promise<Response> {
    const { name, password, email } = req.body;
    const SALT_ROUNDS = 10;

    if (req.user?.role !== 'super_admin') {
      return res.status(403).send(
        { error: 'Forbidden: You do not have permission to perform this action',}
    );
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newOutlet = await prisma.outlet.create({
        data: {
          name,
          password: hashedPassword,
          email,
        },
      });

      return res.status(201).send(newOutlet);
    } catch (error) {
      console.error('Error creating outlet:', error);
      return res.status(500).send({ error: 'Error creating outlet' });
    }
  }

  async updateOutlet(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const emailFromToken = req.user?.email;
    const { name, password, email } = req.body;
    const SALT_ROUNDS = 10;
    try {
      const outlet = await prisma.outlet.findUnique({
        where: { id: Number(id) },
      });

      if (!outlet) {
        return res.status(404).send({ error: 'Outlet not found' });
      }

      const updatedData: any = {
        name,
        email,
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, SALT_ROUNDS);
      }

      const updatedOutlet = await prisma.outlet.update({
        where: { id: Number(id) },
        data: updatedData,
      });

      return res.status(200).send({ updatedOutlet, emailFromToken });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Outlet not found' });
      }
      return res.status(500).send({ error: 'Error updating outlet' });
    }
  }

  async deleteOutlet(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      await prisma.outlet.delete({
        where: { id: Number(id) },
      });

      return res.status(204).send({ msg: 'Outlet has been deleted' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Outlet not found' });
      }
      return res.status(500).send({ error: 'Error deleting outlet' });
    }
  }

  async loginOutlet(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const outlet = await prisma.outlet.findUnique({
        where: { email },
      });

      if (!outlet) {
        return res.status(401).send({ error: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, outlet.password);
      console.log('input:', password, ' db:', outlet.password);

      if (!passwordMatch) {
        return res.status(401).send({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: outlet.id, email: outlet.email, role: 'outlet' },
        process.env.JWT_SECRET || 'sangat rahasia',
        {
          expiresIn: '7d',
        },
      );

      return res.status(200).send({
        token: token,
        outletName: outlet.name,
        outletEmail: outlet.email,
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).send({ error: 'Error during login' });
    }
  }

}
