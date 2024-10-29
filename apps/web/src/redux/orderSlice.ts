import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder } from '../api';

export interface Order {
  id: number;
  title: string;
  status: string;
}

const initialState: Order[] = [];

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await fetch('http://localhost:8000/api/orders');
  const data = await response.json();
  return data;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { setOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
