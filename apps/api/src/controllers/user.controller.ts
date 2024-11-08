import { Request, Response } from 'express';
import prisma from '@/prisma';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updates,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user' });
  }
};
