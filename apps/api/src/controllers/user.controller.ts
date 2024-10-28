// File: src/controllers/user.controller.ts
import { Request, Response } from 'express';
import User from '../models/user.model'; // Mengimpor User sebagai default

// Melihat semua pengguna
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Mengambil semua pengguna
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

// Membuat pengguna baru
export const createUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body; // Pastikan Anda menerima data yang diperlukan
  try {
    const user = new User({ username, password, role });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
};

// Memperbarui pengguna
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; // Mengambil ID dari parameter
  const updates = req.body; // Mengambil data yang akan diperbarui
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

// Menghapus pengguna
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params; // Mengambil ID dari parameter
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(204).send(); // Mengembalikan status 204 jika berhasil dihapus
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user' });
  }
};
