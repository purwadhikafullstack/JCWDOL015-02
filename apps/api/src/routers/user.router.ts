import { UserController } from '@/controllers/user.controller';
import { uploaderImg } from '@/helpers/uploader';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController : UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/profile', this.userController.getUserProfile)
    this.router.delete('/delete/:id', this.userController.deleteUser);
    this.router.patch('/update-mail', this.userController.updateMailUser);
    this.router.patch('/only-verify', this.userController.onlyVerifyAccount);
    this.router.patch('/delete-avatar', this.userController.deleteAvatar);
    this.router.patch('/update-username', this.userController.updateUsername);
    this.router.patch('/update-password', this.userController.updatePasswordUser);
    this.router.patch(
      '/update-avatar',
      uploaderImg("avatar-","/avatar").single('avatar'),
      this.userController.updateAvatar
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
