import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// Rute untuk login
router.post('/login', login);

export default router;
