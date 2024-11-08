// frontend/src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice'; // Pastikan Anda punya orderSlice

const store = configureStore({
  reducer: {
    order: orderReducer, // Reducer yang digunakan untuk state pesanan
  },
});

export default store;
