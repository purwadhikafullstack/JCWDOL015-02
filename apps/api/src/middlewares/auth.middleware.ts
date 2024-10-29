import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface User extends JwtPayload {
  id: string;
  name: string;
  role: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Access denied.');

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(500)
      .send('Internal server error: JWT_SECRET is not defined.');
  }

  jwt.verify(token, secret, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) return res.status(403).send('Access denied.');
    (req as any).user = decoded as User;
    next();
  });
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if ((req as any).user?.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }
  next();
};
