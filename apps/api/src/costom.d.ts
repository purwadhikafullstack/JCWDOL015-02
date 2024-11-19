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
      user?: IUserData;
    }
  }

  declare module 'midtrans-client' {
    export class Snap {
      constructor(config: {
        isProduction: boolean;
        serverKey: string;
        clientKey: string;
      });

      createTransaction(param: any): Promise<any>;
      transaction: {
        notification(param: any): Promise<any>;
      };
    }
  }
}
