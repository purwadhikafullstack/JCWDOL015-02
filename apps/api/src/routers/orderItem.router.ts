import { OrderItemController } from '@/controllers/orderItems.controllers';
import { Router } from 'express';


export class OrderItemRouter {
  private router: Router;
  private orderItemController: OrderItemController;

  constructor() {
    this.orderItemController = new OrderItemController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Mendapatkan semua order item
    this.router.get('/', this.orderItemController.getOrderItems);

    // Mendapatkan order item berdasarkan ID
    this.router.get('/:id', this.orderItemController.getOrderItemById);

    // Mendapatkan order items berdasarkan orderId
    this.router.get('/order/:orderId', this.orderItemController.getOrderItemsByOrderId);

    // Membuat order item baru
    this.router.post('/', this.orderItemController.createOrderItem);
  }

  getRouter(): Router {
    return this.router;
  }
}
