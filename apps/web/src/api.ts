import axios from 'axios';
import { Order } from './redux/orderSlice';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data;
};

export const createOrder = async (
  orderData: Omit<Order, 'id'>,
): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
