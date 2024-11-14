// // src/controllers/admin.controller.ts
// import { Request, Response } from 'express';
// import prisma from '@/prisma';

// export class AdminController {
//   async getAllUsers(req: Request, res: Response): Promise<Response> {
//     try {
//       const users = await prisma.user.findMany();
//       return res.status(200).json(users);
//     } catch (error) {
//       return res.status(500).json({ message: 'Error retrieving users', error });
//     }
//   }

//   async getUserById(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params;
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id: parseInt(id) },
//       });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       return res.status(200).json(user);
//     } catch (error) {
//       return res.status(500).json({ message: 'Error retrieving user', error });
//     }
//   }

//   async createUser(req: Request, res: Response): Promise<Response> {
//     const userData = req.body;
//     try {
//       const newUser = await prisma.user.create({ data: userData });
//       return res.status(201).json(newUser);
//     } catch (error) {
//       return res.status(500).json({ message: 'Error creating user', error });
//     }
//   }

//   async updateUser(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params;
//     const userData = req.body;
//     try {
//       const updatedUser = await prisma.user.update({
//         where: { id: parseInt(id) },
//         data: userData,
//       });
//       return res.status(200).json(updatedUser);
//     } catch (error) {
//       return res.status(500).json({ message: 'Error updating user', error });
//     }
//   }

//   async deleteUser(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params;
//     try {
//       const deletedUser = await prisma.user.delete({
//         where: { id: parseInt(id) },
//       });
//       return res.status(204).send();
//     } catch (error) {
//       return res.status(500).json({ message: 'Error deleting user', error });
//     }
//   }
// }

// export const adminController = new AdminController();
