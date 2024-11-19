import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import '@/helpers/cron/customerCron';
import { PORT } from './config';
import cookieParser from 'cookie-parser';
import { SampleRouter } from './routers/sample.router';
import { AttendanceRouter } from './routers/attendence.router';
import { AddressRouter } from './routers/address.router ';
import { OutletRouter } from './routers/outlet.router';
import { OutletWorkerRouter } from './routers/outletWorker.router';
import { OrderRouter } from './routers/order.router';
import { SuperAdminRouter } from './routers/superAdmin.router';
import { NotificationRouter } from './routers/notification.router';
import path from 'path';
import dotenv from 'dotenv';
import { AuthRouter } from './routers/auth.router';
import { GoogleRouter } from './routers/google.router';
import { UserRouter } from './routers/user.router';
import { MailRouter } from './routers/mail.router';
import laundryItemRouter from './routers/laundryItem.router';
import { OutletAssignmentRouter } from './routers/outletAssignment.router';
import { PickupDeliveryRequestRouter } from './routers/pdrd.router';
import { OrderItemRouter } from './routers/orderItem.router';
import { WorkerJobHistoryRouter } from './routers/workHistory.router';
import { ReportAnalysisRouter } from './routers/reportAnalysis.router';
dotenv.config();
export default class App {
  private app: Express;
  private PORT: string | number;

  constructor(port: string | number) {
    this.app = express();
    this.PORT = port;
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cookieParser());
    const allowedOrigins: string[] = [
      'http://localhost:3000',
      'http://localhost:8000',
    ];

    // CORS middleware
    this.app.use(
      cors({
        credentials: true,
        origin: (
          origin: string | undefined,
          callback: (err: Error | null, allow: boolean) => void,
        ) => {
          if (allowedOrigins.includes(origin as string) || !origin) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'), false);
          }
        },
      }),
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(
      '/api/public',
      express.static(path.join(__dirname, '../public')),
    );
  }

  private handleError(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const googleRouter = new GoogleRouter();
    const mailRouter = new MailRouter();
    const authRouter = new AuthRouter();
    const userRouter = new UserRouter();
    const sampleRouter = new SampleRouter();
    const attendanceRouter = new AttendanceRouter();
    const addressRouter = new AddressRouter();
    const outletRouter = new OutletRouter();
    const outletAssignmentRouter = new OutletAssignmentRouter();
    const outletWorkerRouter = new OutletWorkerRouter();
    const orderRouter = new OrderRouter();
    const superAdminRouter = new SuperAdminRouter();
    const notificationRouter = new NotificationRouter();
    const reportAnalysisRouter = new ReportAnalysisRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/google', googleRouter.getRouter());
    this.app.use('/api/mail', mailRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/samples', sampleRouter.getRouter());
    this.app.use('/api/address', addressRouter.getRouter());
    this.app.use('/api/attendence', attendanceRouter.getRouter());
    this.app.use('/api/order', orderRouter.getRouter());
    this.app.use('/api/outlet', outletRouter.getRouter());
    this.app.use('/api/outlet-workers', outletWorkerRouter.getRouter());
    this.app.use('/api/laundryitems', laundryItemRouter);
    this.app.use('/api/outlet-assignment', outletAssignmentRouter.getRouter());
    this.app.use('/api/super-admin', superAdminRouter.getRouter());
    this.app.use('/api/notification', notificationRouter.getRouter());
    this.app.use('/api/report-analysis', reportAnalysisRouter.getRouter());
  }

  public start(): void {
    this.app.listen(this.PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
