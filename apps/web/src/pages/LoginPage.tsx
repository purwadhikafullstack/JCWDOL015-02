'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../app/page.module.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      window.location.href = '/admin';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Admin Login</h2>
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your username"
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
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
