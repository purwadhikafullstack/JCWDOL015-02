import React from 'react';

interface OrderDetailsProps {
  order: any;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => (
  <div>
    <h3>Order Details</h3>
    <p>ID: {order.id}</p>
    <p>Status: {order.status}</p>
    <p>Total Items: {order.items.length}</p>
  </div>
);
