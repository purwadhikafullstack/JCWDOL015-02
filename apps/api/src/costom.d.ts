import { JwtPayload } from 'jsonwebtoken';

// Definisikan tipe `IUserData` untuk payload user
export interface IUserData extends JwtPayload {
  id: number;
  name?: string;
  email: string;
  role: string;
}

// Deklarasi global untuk menambahkan `user` ke dalam `Request`
declare global {
  namespace Express {
    export interface Request {
      user?: IUserData; // Tambahkan `user` sebagai properti opsional di `Request`
    }
  }
}

export {}; // Pastikan file dianggap sebagai modul
