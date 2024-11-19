import { PaymentController } from '@/controllers/payment.controller';

import { Router } from 'express';

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create', this.paymentController.createPayment);
    this.router.post('/callback/midtrans', this.paymentController.callbackPayment);
  }

  getRouter(): Router {
    return this.router;
  }
}
