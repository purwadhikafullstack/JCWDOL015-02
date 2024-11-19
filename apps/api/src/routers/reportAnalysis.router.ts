import { Router } from 'express';
import { ReportAnalysisController } from '@/controllers/reportAnalysis.controller';
import { authMiddleware } from '@/middlewares/auth.middleware'; // Pastikan middleware ini diimport dengan benar jika diperlukan

export class ReportAnalysisRouter {
  private router: Router;
  private reportAnalysisController: ReportAnalysisController;

  constructor() {
    this.router = Router();
    this.reportAnalysisController = new ReportAnalysisController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Endpoint untuk laporan penjualan
    this.router.get(
      '/sales',
      authMiddleware,
      this.reportAnalysisController.getSalesReport,
    );

    // Endpoint untuk laporan performa karyawan
    this.router.get(
      '/employee-performance',
      authMiddleware,
      this.reportAnalysisController.getEmployeePerformanceReport,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
