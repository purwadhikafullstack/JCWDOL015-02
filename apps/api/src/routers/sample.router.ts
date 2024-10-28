import { SampleController } from '@/controllers/sample.controller';
import { Router } from 'express';

export class SampleRouter {
  private router: Router;
  private sampleController: SampleController;

  constructor() {
    this.sampleController = new SampleController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.sampleController.registerUserWithMail);
    this.router.delete('/delete/:id', this.sampleController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
