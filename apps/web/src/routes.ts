import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OrdersPage from './pages/Orders';
import ReportsPage from './pages/reports'; // Impor halaman laporan

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/reports" element={<ReportsPage />} /> {/* Tambahkan rute untuk laporan */}
        <Route path="/" element={<div>Halaman Utama</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;