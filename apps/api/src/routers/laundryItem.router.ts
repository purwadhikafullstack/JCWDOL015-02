import { Router } from 'express';
import {
  createLaundryItem,
  getLaundryItems,
  updateLaundryItem,
  deleteLaundryItem,
} from '../controllers/laundryItem.controller';

const router = Router();

router.post('/', createLaundryItem); // Menambah laundry item
router.get('/', getLaundryItems); // Mendapatkan semua laundry items
router.put('/:id', updateLaundryItem); // Mengupdate laundry item
router.delete('/:id', deleteLaundryItem); // Menghapus laundry item

export default router;
