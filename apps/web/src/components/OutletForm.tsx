// frontend/src/components/OrderForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Mengimpor useDispatch
import { addOrder } from '../redux/orderSlice'; // Mengimpor aksi untuk menambahkan order

const OrderForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch(); // Mendapatkan dispatch untuk memanggil aksi

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addOrder({
        title,
        id: 0,
        status: '',
      }),
    ); // Memanggil aksi addOrder
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default OrderForm;
