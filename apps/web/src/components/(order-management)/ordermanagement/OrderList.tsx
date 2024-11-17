import React from 'react';

interface OrderListProps {
  orders: any[]; // Gantilah 'any' dengan tipe data yang lebih spesifik sesuai struktur data pesanan Anda
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="mt-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Outlet</th>
            <th className="px-4 py-2 border">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-2 border">{order.id}</td>
              <td className="px-4 py-2 border">{order.status}</td>
              <td className="px-4 py-2 border">{order.outlet}</td>
              <td className="px-4 py-2 border">{order.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
