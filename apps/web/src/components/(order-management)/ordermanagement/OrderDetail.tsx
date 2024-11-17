import React from 'react';

interface OrderDetailProps {
  order: any; // Gantilah 'any' dengan tipe data pesanan yang lebih spesifik
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  if (!order) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Order ID: {order.id}</h2>
      <div>Status: {order.status}</div>
      <div>Outlet: {order.outlet}</div>
      <div>Total Price: {order.totalPrice}</div>
      <div>Created At: {new Date(order.createdAt).toLocaleDateString()}</div>
    </div>
  );
};

export default OrderDetail;
