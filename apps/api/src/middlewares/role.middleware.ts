import { Request, Response, NextFunction } from 'express';

type Role = 'admin' | 'outlet_admin' | 'customer';

type User = {
  id: number;
  email: string;
  role: Role;
};

export const verifyRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User | undefined;

      if (!user) {
        return res.status(401).json({
          message: 'Unauthorized: User not authenticated.',
        });
      }

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
        error: (error as Error).message,
      });
    }
  };
};
