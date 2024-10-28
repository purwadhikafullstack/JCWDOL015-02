import express from 'express';
import { getReports } from '../controllers/report.controller';
const router = express.Router();

router.get('/reports', getReports); // Endpoint untuk mendapatkan laporan

export default router;
