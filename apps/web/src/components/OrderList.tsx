// src/components/OrderList.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../redux/orderSlice'; // Impor aksi fetchOrders
import { AppDispatch, RootState } from '../redux/store'; // Impor tipe dari store

export const OrderList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Tipe dispatch
  const orders = useSelector((state: RootState) => state.orders); // Ambil daftar pesanan dari state

  useEffect(() => {
    dispatch(fetchOrders()); // Ambil daftar pesanan saat komponen pertama kali dimuat
  }, [dispatch]);

  return (
    <div>
      <h2>Order List</h2>
      {orders.length > 0 ? ( // Cek jika ada pesanan
        orders.map(
          (
            order: any, // Iterasi dan tampilkan setiap pesanan
          ) => (
            <div key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Title: {order.title}</p> {/* Tampilkan judul pesanan */}
              <p>Status: {order.status}</p> {/* Tampilkan status pesanan */}
            </div>
          ),
        )
      ) : (
        <p>No orders found.</p> // Tampilkan pesan jika tidak ada pesanan
      )}
    </div>
  );
};
