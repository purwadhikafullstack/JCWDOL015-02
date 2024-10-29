import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(500)
      .json({ message: 'Internal server error: JWT_SECRET is not defined.' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: '1h',
  });
  return res.json({ token });
};
