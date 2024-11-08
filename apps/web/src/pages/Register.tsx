'use client'; // Menandakan bahwa ini adalah komponen client

import React, { useState } from 'react';
import styles from '../app/page.module.css'; // Sesuaikan dengan lokasi file styles

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proses registrasi logic
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create an Account</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
