// File: src/routers/user.router.ts
import express from 'express';
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { body, param, validationResult } from 'express-validator';
import {
  authMiddleware,
  adminMiddleware,
} from '../middlewares/auth.middleware'; // Mengimpor middleware

const router = express.Router();

const validateCreateUser = [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['admin', 'outlet', 'worker', 'driver'])
    .withMessage('Role must be one of admin, outlet, worker, or driver'),
];

const validateGetUser = [
  param('id').isMongoId().withMessage('User ID must be a valid MongoDB ID'),
];

router.post(
  '/users',
  authMiddleware,
  adminMiddleware,
  validateCreateUser,
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createUser(req, res);
  },
);

router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  (req: express.Request, res: express.Response) => {
    getAllUsers(req, res);
  },
);

router.get(
  '/users/:id',
  authMiddleware,
  adminMiddleware,
  validateGetUser,
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    getUser(req, res);
  },
);

router.put(
  '/users/:id',
  authMiddleware,
  adminMiddleware,
  validateGetUser,
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    updateUser(req, res);
  },
);

// Rute untuk menghapus user
router.delete(
  '/users/:id',
  authMiddleware,
  adminMiddleware,
  validateGetUser,
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    deleteUser(req, res);
  },
);

export default router;

function getUser(req: express.Request, res: express.Response) {
  throw new Error('Function not implemented.');
}
