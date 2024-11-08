'use client'; // Add this at the top of your file

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from '../redux/orderSlice';
import { createOrder } from '../api';
import { Order } from '../redux/orderSlice';

const OrderForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Omit<Order, 'id'> = { title, status: 'pending' };
    try {
      const createdOrder = await createOrder(newOrder);
      dispatch(addOrder(createdOrder));
      setTitle('');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Judul Pesanan"
        required
      />
      <button type="submit">Tambah Pesanan</button>
    </form>
  );
};

export default OrderForm;
