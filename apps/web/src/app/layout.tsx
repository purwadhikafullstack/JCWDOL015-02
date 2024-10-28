import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LaunON.',
  description: 'Owned and operated by LaunON Style',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header/>
        {children}
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          closeOnClick
          draggable
        />
      </body>
    </html>
  );
}
