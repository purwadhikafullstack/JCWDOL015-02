// src/components/OrderForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from '../redux/orderSlice'; // Pastikan path ini benar
import { createOrder } from '../api'; // Import fungsi createOrder
import { Order } from '../redux/orderSlice'; // Impor tipe Order jika diperlukan

const OrderForm: React.FC = () => {
  const [title, setTitle] = useState(''); // State untuk judul pesanan
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Membuat objek pesanan baru
    const newOrder: Omit<Order, 'id'> = { title, status: 'pending' }; // Tambahkan status default
    try {
      const createdOrder = await createOrder(newOrder); // Panggil createOrder dari API
      dispatch(addOrder(createdOrder)); // Tambahkan ke Redux state
      setTitle(''); // Reset form setelah berhasil
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Update state saat input berubah
        placeholder="Judul Pesanan" // Placeholder untuk input
        required // Pastikan input diisi
      />
      <button type="submit">Tambah Pesanan</button>{' '}
      {/* Tombol untuk submit form */}
    </form>
  );
};

export default OrderForm; // Ekspor default
