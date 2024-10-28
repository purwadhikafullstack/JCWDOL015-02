// src/api.ts
import axios from 'axios';
import { Order } from './redux/orderSlice'; // Pastikan path ini benar sesuai dengan struktur folder Anda

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ganti dengan URL API Anda
});

// Fungsi untuk mengambil semua pesanan
export const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data; // Mengembalikan data pesanan
};

// Fungsi untuk membuat pesanan baru
export const createOrder = async (
  orderData: Omit<Order, 'id'>,
): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  return response.data; // Mengembalikan pesanan yang baru dibuat
};

// Tambahkan fungsi API lain sesuai kebutuhan
