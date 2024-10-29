import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/orders', authMiddleware, OrderController.getAllOrders);
router.post('/orders/create', authMiddleware, OrderController.createOrder);
router.put('/orders/confirm', authMiddleware, OrderController.confirmOrder);

export default router;
