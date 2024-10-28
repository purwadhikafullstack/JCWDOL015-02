import { Router } from 'express';
import {
  createOutlet,
  getOutlets,
  updateOutlet,
  deleteOutlet,
} from '../controllers/outlet.controller';

const router = Router();

router.post('/', createOutlet);
router.get('/', getOutlets);
router.put('/:id', updateOutlet);
router.delete('/:id', deleteOutlet);

export default router;
