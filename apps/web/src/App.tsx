import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import OutletManagement from './pages/OutletManagement';
import LaundryItemManagement from './pages/LaundryItemManagement';
import UserAssignment from './pages/UserAssignment';
import OrdersPage from './pages/orders';

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/outlets" element={<OutletManagement />} />
          <Route path="/laundry-items" element={<LaundryItemManagement />} />
          <Route path="/assign-user" element={<UserAssignment />} />{' '}
          <Route path="/orders" element={<OrdersPage />} />{' '}
          <Route
            path="/"
            element={<h2>Welcome to the Laundry Management System</h2>}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
