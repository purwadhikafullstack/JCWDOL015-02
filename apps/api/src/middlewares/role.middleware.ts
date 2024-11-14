import { Request, Response, NextFunction } from 'express';

type Role = 'admin' | 'outlet_admin' | 'worker' | 'driver';

type User = {
  id: string;
  name: string;
  role: Role;
};

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User | undefined;

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: User not authenticated.' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message:
          'Access denied: You do not have permission to access this resource.',
      });
    }

    next();
  };
};
