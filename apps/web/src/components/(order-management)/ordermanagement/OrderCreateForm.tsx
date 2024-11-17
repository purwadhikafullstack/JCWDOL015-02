import React, { useState } from 'react';
import { getToken } from '@/lib/server';

const token = getToken();
const OrderCreateForm: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState({
    outlet: '',
    status: 'pending',
    totalPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gantilah API URL dengan endpoint yang sesuai untuk pembuatan pesanan baru
    const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // Reset form setelah berhasil mengirimkan data
      setOrderDetails({ outlet: '', status: 'pending', totalPrice: 0 });
      alert('Order created successfully');
    } catch (error) {
      alert('Error creating order');
    }
  };

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create New Order
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="outlet"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Outlet
          </label>
          <input
            type="text"
            name="outlet"
            id="outlet"
            value={orderDetails.outlet}
            onChange={handleChange}
            placeholder="Enter outlet name"
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="totalPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Total Price
          </label>
          <input
            type="number"
            name="totalPrice"
            id="totalPrice"
            value={orderDetails.totalPrice}
            onChange={handleChange}
            placeholder="Enter total price"
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderCreateForm;
