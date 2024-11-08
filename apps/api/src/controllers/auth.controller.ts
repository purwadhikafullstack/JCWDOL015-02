import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model'; // Mengimpor IUser untuk tipe yang lebih tepat
import jwt from 'jsonwebtoken';
import { sendMail } from '../helpers/nodemailer';
import bcrypt from 'bcryptjs'; // Menambahkan bcrypt untuk enkripsi password

export class AuthController {
  // Fungsi untuk login
  async login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    try {
      // Mencari pengguna berdasarkan username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Mengecek password menggunakan bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Jika pengguna ditemukan dan password valid, buat token JWT
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({
          message: 'Internal server error: JWT_SECRET is not defined.',
        });
      }

      const token = this.generateToken(user);

      // Kirim email verifikasi setelah login sukses
      const subject = 'Login Successful';
      const text = `Hi ${user.username},\n\nYou have successfully logged in! Here's your token: ${token}`;

      await sendMail({ to: user.email, subject, text }); // Mengirim email kepada user dengan token

      return res.json({ token }); // Kembalikan token ke frontend
    } catch (error) {
      console.error(error); // Menambahkan logging error untuk memudahkan debugging
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Fungsi untuk membuat token JWT
  generateToken(user: IUser): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined.');
    }
    return jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: '1h',
    });
  }

  // Fungsi untuk registrasi user baru
  async register(req: Request, res: Response): Promise<Response> {
    const { username, password, email } = req.body;

    try {
      // Periksa apakah username sudah ada
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Mengenkripsi password sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);

      // Membuat user baru
      const newUser = new User({ username, password: hashedPassword, email });
      await newUser.save();

      // Kirim email verifikasi setelah registrasi
      const subject = 'Welcome to Our Service';
      const text = `Hello ${newUser.username},\n\nThank you for registering!`;

      await sendMail({ to: newUser.email, subject, text }); // Mengirim email verifikasi ke pengguna baru

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error); // Menambahkan logging error
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const authController = new AuthController();
