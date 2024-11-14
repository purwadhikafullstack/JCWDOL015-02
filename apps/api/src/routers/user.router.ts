import { UserController } from '@/controllers/user.controller';
import { uploaderImg } from '@/middlewares/uploader';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  // Inisialisasi rute-rute yang diperlukan
  private initializeRoutes(): void {
    this.router.get('/', this.userController.getUsers); // Menampilkan semua user
    this.router.post('/register', this.userController.createUser); // Membuat user baru
    this.router.put('/:id', this.userController.updateUser); // Memperbarui data user
    this.router.delete('/:id', this.userController.deleteUser); // Menghapus user berdasarkan ID

    // Rute tambahan untuk manajemen profil user dan lainnya
    this.router.get('/profile', this.userController.getUserProfile);
    this.router.patch('/update-mail', this.userController.updateMailUser);
    this.router.patch('/only-verify', this.userController.onlyVerifyAccount);
    this.router.patch('/delete-avatar', this.userController.deleteAvatar);
    this.router.patch('/update-username', this.userController.updateUsername);
    this.router.patch(
      '/update-password',
      this.userController.updatePasswordUser,
    );
    this.router.patch(
      '/update-avatar',
      uploaderImg('avatar-', '/avatar').single('avatar'),
      this.userController.updateAvatar,
    );
  }

  // Mengembalikan objek router
  getRouter(): Router {
    return this.router;
  }
}
