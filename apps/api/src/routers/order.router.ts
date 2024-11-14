import { OrderController } from '@/controllers/order.controller';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.orderController.getAllOrder);
    this.router.get('/:orderId', this.orderController.getOrderById);
    this.router.post('/create', this.orderController.createOrder);
    this.router.patch('/:orderId', this.orderController.updateOrder);
    this.router.delete('/:orderId', this.orderController.deleteOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
