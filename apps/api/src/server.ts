import express from 'express';
import reportRoutes from './routers/report.router';
const app = express();

app.use(express.json());
app.use('/api', reportRoutes); // Menggunakan rute laporan

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
