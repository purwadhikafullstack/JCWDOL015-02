'use client';

import { useState } from 'react';
import axios from 'axios';

export default function OutletDetail() {
  const [outletId, setOutletId] = useState<number | string>('');
  const [outletData, setOutletData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOutlet = async () => {
    if (!outletId || isNaN(Number(outletId))) {
      setError('Please enter a valid numeric ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/outlet/id/${outletId}`,
      );
      setOutletData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching outlet data.');
      setOutletData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/api/order');
      setOrders(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://keranji.id/storage/artikel/content/828-Desain-Toko-Laundry-Minimalis-4.jpg')`,
      }}
    >
      <div className="p-6 bg-white bg-opacity-90 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Search Outlet & View Orders
        </h1>

        {/* Input Outlet ID */}
        <div className="mb-4">
          <label
            htmlFor="outletId"
            className="block text-gray-700 font-medium mb-2"
          >
            Enter Outlet ID
          </label>
          <input
            type="text"
            id="outletId"
            value={outletId}
            onChange={(e) => setOutletId(e.target.value)}
            placeholder="Enter numeric ID"
            className="w-full bg-white text-gray-800 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Tombol Actions */}
        <div className="flex justify-between items-center space-x-2">
          <button
            onClick={fetchOutlet}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            {loading && outletData === null ? 'Searching...' : 'Search Outlet'}
          </button>
          <button
            onClick={fetchOrders}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            {loading && orders.length === 0 ? 'Loading...' : 'View All Orders'}
          </button>
          <button
            onClick={() => {
              setOutletData(null);
              setOrders([]);
              setError(null);
              setOutletId('');
            }}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Outlet Details */}
        {outletData && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Outlet Details
            </h2>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li>
                <strong>ID:</strong> {outletData.id}
              </li>
              <li>
                <strong>Name:</strong> {outletData.name}
              </li>
              <li>
                <strong>Email:</strong> {outletData.email}
              </li>
              <li>
                <strong>Address:</strong> {outletData.address}
              </li>
              <li>
                <strong>Phone:</strong> {outletData.phone}
              </li>
            </ul>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">All Orders</h2>
            <ul className="mt-2 space-y-2 text-gray-700">
              {orders.map((order, index) => (
                <li key={index} className="border-b pb-2">
                  <strong>ID:</strong> {order.id} - <strong>Status:</strong>{' '}
                  {order.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
