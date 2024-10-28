// src/redux/orderSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder } from '../api'; // Impor fungsi createOrder

// Definisikan tipe Order
export interface Order {
  id: number; // ID pesanan
  title: string; // Judul pesanan
  status: string; // Status pesanan, misalnya "pending", "completed", dll.
}

// Contoh inisialisasi state
const initialState: Order[] = [];

// Fungsi untuk mengambil pesanan dari API
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await fetch('http://localhost:8000/api/orders'); // Ganti dengan URL API Anda
  const data = await response.json();
  return data; // Mengembalikan data yang diterima dari API
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      return action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.push(action.payload);
    },
    // Tambahkan reducer lain sesuai kebutuhan
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      return action.payload; // Mengupdate state dengan data yang diambil dari API
    });
  },
});

// Ekspor reducer dan action
export const { setOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
