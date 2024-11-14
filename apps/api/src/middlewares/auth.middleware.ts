import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Definisikan tipe `User` untuk menyimpan payload token
export interface User extends JwtPayload {
  id: number;
  name: string;
  role: string;
  email: string;
}

// Middleware untuk autentikasi dan pemeriksaan role superAdmin
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Ambil token dari header Authorization
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error: JWT_SECRET is not defined.',
    });
  }

  // Verifikasi token menggunakan JWT
  jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Jika token berhasil didekode, tambahkan user ke req dan lanjutkan
    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded as User; // Tentukan `req.user` menggunakan tipe `User`

      // Pemeriksaan role untuk superAdmin (opsional)
      // if (req.user.role !== 'superAdmin') {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'Access denied: Not authorized to register outlets.',
      //   });
      // }

      return next();
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  });
};
