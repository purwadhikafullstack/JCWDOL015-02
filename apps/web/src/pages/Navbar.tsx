'use client'; // Tambahkan ini di bagian atas

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-blue-600 shadow-md sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-white font-bold text-2xl">
          <Link href="/">LaundryApp</Link>
        </div>
        <ul className="hidden md:flex space-x-8 text-white">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="../pages/Register">Register</Link>{' '}
            {/* Update URL path */}
          </li>
          <li>
            <Link href="../pages/LoginPage.tsx">Login</Link>{' '}
            {/* Update URL path */}
          </li>
        </ul>
        {/* Tombol Hamburger untuk Mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
      {/* Menu Dropdown untuk Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-600 text-white py-4 px-6 space-y-6">
          <Link href="/" onClick={toggleMobileMenu} className="block">
            Home
          </Link>
          <Link href="/about" onClick={toggleMobileMenu} className="block">
            About
          </Link>
          <Link href="/services" onClick={toggleMobileMenu} className="block">
            Services
          </Link>
          <Link href="/login" onClick={toggleMobileMenu} className="block">
            {' '}
            {/* Update URL path */}
            Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
