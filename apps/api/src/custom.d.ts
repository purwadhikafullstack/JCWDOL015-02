// src/custom.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; name: string; role: string };
    }
  }
}

export {}; // Menandai file sebagai modul
