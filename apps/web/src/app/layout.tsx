import Footer from '@/components/Footer';
import type { ReactNode } from 'react';
import Navbar from '@/pages/Navbar';
import LoginPage from '@/pages/LoginPage';
import OrderForm from '@/components/OrderForm';
import RegisterPage from '@/pages/Register';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body className="container">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
