// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice'; // Impor orderSlice

const store = configureStore({
  reducer: {
    orders: orderReducer, // Daftarkan reducer untuk orders
  },
});

// Ekspor store
export type RootState = ReturnType<typeof store.getState>; // Mendapatkan tipe state
export type AppDispatch = typeof store.dispatch; // Mendapatkan tipe dispatch
export default store;
