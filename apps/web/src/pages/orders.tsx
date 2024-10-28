// /pages/orders.tsx
import React from 'react';
import { OrderList } from '../components/OrderList'; // Impor OrderList dengan kurung kurawal karena named export
import OrderForm from '../components/OrderForm'; // Impor sebagai default

const OrdersPage: React.FC = () => (
  <div>
    <h1>Order Management</h1>
    <OrderForm />
    <OrderList />
  </div>
);

export default OrdersPage;
