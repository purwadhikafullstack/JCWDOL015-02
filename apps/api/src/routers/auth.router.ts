import { AuthController } from '@/controllers/auth.controller'; // Pastikan ini benar
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.authController.registerUserWithMail);
    this.router.post('/set-password', this.authController.setPassword);
    this.router.post('/login', this.authController.loginWithMail);
    this.router.delete('/logout', this.authController.logoutUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
