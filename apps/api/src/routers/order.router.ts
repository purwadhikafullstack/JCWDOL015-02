import { OrderController } from '@/controllers/order.controller';
import { validateCreateOrder } from '@/middlewares/validator/orderValidator';
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
    this.router.get('/user/:Id', this.orderController.getAllOrderByUserId);
    this.router.post('/search', this.orderController.searcOrder);
    this.router.post('/create', validateCreateOrder, this.orderController.createOrder);
    this.router.put('/:orderId', this.orderController.updateOrder);
    this.router.patch('/:orderId', this.orderController.updateOrderStatus);
    this.router.patch(
      '/price/:orderId',
      this.orderController.updateOrderPriceAndWeight,
    );
    this.router.delete('/:orderId', this.orderController.deleteOrder);
    this.router.post('/confirm', this.orderController.confirmOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
