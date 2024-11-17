import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: number;
  totalWeight: number;
  totalPrice: number;
  status: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    clearLoading: (state) => {
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setOrders, setLoading, clearLoading, setError, clearError } =
  orderSlice.actions;

export default orderSlice.reducer;
