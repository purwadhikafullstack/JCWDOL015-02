import { Router } from 'express';
import {
  createLaundryItem,
  getLaundryItems,
  updateLaundryItem,
  deleteLaundryItem,
} from '../controllers/laundryItem.controller';

const router = Router();

router.post('/', createLaundryItem);
router.get('/', getLaundryItems);
router.put('/:id', updateLaundryItem);
router.delete('/:id', deleteLaundryItem);

export default router;
