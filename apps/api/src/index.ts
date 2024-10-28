// File: src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import { authMiddleware, adminMiddleware } from './middlewares/auth.middleware';

dotenv.config(); // Memuat variabel lingkungan dari file .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Contoh route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Contoh penggunaan middleware
app.get('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route.');
});

// Contoh penggunaan middleware admin
app.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  res.send('Welcome Admin!');
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
