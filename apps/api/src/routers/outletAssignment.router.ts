import { Router } from 'express';
import { OutletAssignmentController } from '@/controllers/outletAssignment.controller';
import { verifyToken } from '@/middlewares/token';
import { verifySuperAdmin } from '@/middlewares/auth.middleware'; // pastikan path ini benar

export class OutletAssignmentRouter {
  private router: Router;
  private outletAssignmentController: OutletAssignmentController;

  constructor() {
    this.outletAssignmentController = new OutletAssignmentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      verifySuperAdmin,
      this.outletAssignmentController.assignUserToOutlet,
    );
    this.router.get(
      '/:id',
      verifyToken,
      verifySuperAdmin,
      this.outletAssignmentController.getAssignById,
    );
    this.router.get(
      '/',
      verifyToken,
      verifySuperAdmin,
      this.outletAssignmentController.getAllOutletAssign,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
