import { Request, Response } from 'express';
import User from '../models/user.model';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  try {
    const user = new User({ username, password, role });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user' });
  }
};
