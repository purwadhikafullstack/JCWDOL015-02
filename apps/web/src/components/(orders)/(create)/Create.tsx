'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setLoading, setError } from '@/redux/slices/orderSlice';
import { useRouter } from 'next/navigation'; // This hook is used for navigation
import { OrderStatus } from '@/type/orderStatus'; // Assuming you have this enum
import { Order } from '@prisma/client'; // Assuming you are using Prisma

const Create = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // State to manage form data
  const [packageName, setPackageName] = useState('');
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalItems, setTotalItems] = useState(1);
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.NEW);
  const [pickupSchedule, setPickupSchedule] = useState<Date | null>(null);
  const [error, setErrorState] = useState<string>('');
  const [loading, setLoadingState] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setLoadingState(true);
    setErrorState('');

    const newOrder = {
      package: packageName,
      totalWeight,
      totalItems,
      status,
      pickupSchedule,
    };

    try {
      const response = await fetch(`${apiUrl}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const createdOrder: Order = await response.json();
      dispatch(setLoading(false));
      setLoadingState(false);
      router.push(`/order_management/detail/${createdOrder.id}`); // Redirect to the newly created order details page
    } catch (err: any) {
      dispatch(setError(err.message));
      setErrorState(err.message);
      setLoadingState(false);
    }
  };

  return (
    <div className="bg-white p-8 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create New Order
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Package */}
          <div className="mb-4">
            <label htmlFor="package" className="block text-gray-700">
              Package Name
            </label>
            <input
              type="text"
              id="package"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              className="mt-2 p-2 border bg-white text-gray-700 border-gray-300 rounded w-full"
              required
            />
          </div>

          {/* Total Weight */}
          <div className="mb-4">
            <label htmlFor="totalWeight" className="block text-gray-700">
              Total Weight (kg)
            </label>
            <input
              type="number"
              id="totalWeight"
              value={totalWeight}
              onChange={(e) => setTotalWeight(Number(e.target.value))}
              className="mt-2 p-2 border  bg-white text-gray-700 border-gray-300 rounded w-full"
              required
            />
          </div>

          {/* Total Items */}
          <div className="mb-4">
            <label htmlFor="totalItems" className="block text-gray-700">
              Total Items
            </label>
            <input
              type="number"
              id="totalItems"
              value={totalItems}
              onChange={(e) => setTotalItems(Number(e.target.value))}
              className="mt-2 p-2 border  bg-white text-gray-700 border-gray-300 rounded w-full"
              required
            />
          </div>

          {/* Order Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="mt-2 p-2 border  bg-white text-gray-700 border-gray-300 rounded w-full"
            >
              {Object.values(OrderStatus).map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup Schedule */}
          <div className="mb-4">
            <label htmlFor="pickupSchedule" className="block text-gray-700">
              Pickup Schedule
            </label>
            <input
              type="datetime-local"
              id="pickupSchedule"
              value={
                pickupSchedule ? pickupSchedule.toISOString().slice(0, 16) : ''
              }
              onChange={(e) => setPickupSchedule(new Date(e.target.value))}
              className="mt-2 p-2 border  bg-white text-gray-700 border-gray-300 rounded w-full"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
