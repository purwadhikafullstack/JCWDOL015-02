// /middlewares/role.middleware.ts
import { Request, Response, NextFunction } from 'express';

// Definisikan tipe Role
type Role = 'admin' | 'outlet_admin' | 'customer';

// Definisikan tipe User
type User = {
  id: number; // Sesuaikan tipe id sesuai kebutuhan
  email: string;
  role: Role; // Pastikan role adalah salah satu dari enum Role
  // Tambahkan properti lain yang diperlukan
};

// Middleware untuk memverifikasi peran pengguna
export const verifyRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User | undefined; // Casting untuk menyesuaikan tipe

      // Periksa apakah user ada
      if (!user) {
        return res.status(401).json({
          message: 'Unauthorized: User not authenticated.',
        });
      }

      // Periksa apakah role user ada dalam allowedRoles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message:
            'Access denied: You do not have permission to access this resource.',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: 'Server error: Unable to process role verification.',
        error: (error as Error).message, // Menggunakan type assertion untuk error
      });
    }
  };
};
