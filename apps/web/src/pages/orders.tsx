// /pages/orders.tsx
import React from 'react';
import { OrderList } from '../components/OrderList';
import OrderForm from '../components/OrderForm';

const OrdersPage: React.FC = () => (
  <div>
    <h1>Order Management</h1>
    <OrderForm />
    <OrderList />
  </div>
);

export default OrdersPage;
