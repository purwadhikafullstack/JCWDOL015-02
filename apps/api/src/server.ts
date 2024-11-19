import express from 'express';
import cors from 'cors';
import { UserRouter } from './routers/user.router';
import dotenv from 'dotenv';
import Outlet from './models/outlet.model';

dotenv.config();

const app = express();
const userRouter = new UserRouter();

// Middleware untuk CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8000'], // Mengizinkan akses dari port 3000 dan 8000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Mengizinkan metode yang digunakan
    credentials: true, // Mengizinkan pengiriman cookies atau header autentikasi
    exposedHeaders: ['Set-Cookie'], // Mengizinkan akses Set-Cookie di response
  }),
);

// Tangani preflight request khusus untuk metode tertentu
app.options('*', cors());

// Middleware untuk parsing JSON dan URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging setiap request (opsional)
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Rute user dan report
app.use('/api/user', userRouter.getRouter());

// Rute untuk mendapatkan data outlet
app.get('/api/outlet', async (req, res) => {
  try {
    const outlets = await Outlet.find();
    res.json(outlets);
  } catch (error) {
    console.error('Error fetching outlets:', error);
    res.status(500).json({ error: 'Error fetching outlets' });
  }
});

// Rute untuk menambahkan outlet baru
app.post('/api/outlet', (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json({ message: 'Name and address are required' });
  }
  res.status(201).json({ id: 3, name, address });
});

// Tangani rute yang tidak ditemukan (404 Not Found)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  },
);

// Menentukan port dan memulai server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
