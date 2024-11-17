import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderStatus } from '../../type/orderStatus'; // Adjust the import path
import { ReactNode } from 'react';
import { Draft } from 'immer';

interface OrderState {
  orders: {
    createdAt: string | number | Date;
    totalWeight: ReactNode;
    outletId: ReactNode;
    package: ReactNode;
    id: number;
    status: OrderStatus;
  }[];
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
    setOrders: (
      state,
      action: PayloadAction<
        {
          createdAt: string | number | Date;
          totalWeight: ReactNode;
          outletId: ReactNode;
          package: ReactNode;
          id: number;
          status: OrderStatus;
        }[]
      >,
    ) => {
      state.orders = action.payload.map((order) => ({
        ...order,
        createdAt: order.createdAt.toString(), // Convert createdAt to string
      }));
      //state.orders = action.payload as Draft<typeof state.orders>;
      //console.log(state.orders)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setOrders, setLoading, setError } = orderSlice.actions;
export default orderSlice.reducer;
