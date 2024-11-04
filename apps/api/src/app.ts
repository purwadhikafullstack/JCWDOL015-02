import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { SampleRouter } from './routers/sample.router';
import { AttendanceRouter } from './routers/attendence.router';
import { AddressRouter} from './routers/address.router ';
import { OutletRouter } from './routers/outlet.router';
import { OrderRouter } from './routers/order.router';
import { SuperAdminRouter } from './routers/superAdmin.router';
import { NotificationRouter } from './routers/notification.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors({credentials: true,origin:'http://localhost:3000'}));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
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
    const sampleRouter = new SampleRouter();
    const attendanceRouter = new AttendanceRouter(); 
    const addressRouter= new AddressRouter()
    const outletRouter = new OutletRouter()
    const orderRouter = new OrderRouter()
    const superAdminRouter = new SuperAdminRouter()
    const notificationRouter = new NotificationRouter()

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/samples', sampleRouter.getRouter());
    this.app.use('/api/address', addressRouter.getRouter());
    this.app.use('/api/attendence', attendanceRouter.getRouter());
    this.app.use('/api/order', orderRouter.getRouter());
    this.app.use('/api/outlet', outletRouter.getRouter());
    this.app.use('/api/super-admin', superAdminRouter.getRouter())
    this.app.use('/api/notification', notificationRouter.getRouter())
    
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
