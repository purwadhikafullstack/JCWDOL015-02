import express from 'express';
import dotenv from 'dotenv';
import { authMiddleware, adminMiddleware } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route.');
});

app.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  res.send('Welcome Admin!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
