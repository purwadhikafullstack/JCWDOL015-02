'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { OrderData, OutletData } from '@/type/worker/outletType';
import { useRouter } from 'next/navigation';
import LogoutWorker from '@/components/(auth)/LogoutWorker';

export default function OutletDashboard() {
  const [outlet, setOutlet] = useState<OutletData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const router = useRouter();
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    const data = localStorage.getItem('outletAdmin');
    if (data) {
      const outletData: OutletData = JSON.parse(data);
      setOutlet(outletData);
    } else {
      router.push('/worker/login');
    }
  }, [router]);

  useEffect(() => {
    if (outlet) {
      axios
        .get(`${backendUrl}/api/order`)
        .then((response) => {
          const filteredOrders = response.data.filter(
            (order: OrderData) => order.outletId === outlet.outletId,
          );
          setOrders(filteredOrders);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        });
    }
  }, [backendUrl, outlet]);

  const handleProcessOrder = (
    orderId: number,
    userId: number,
    distance: number,
  ) => {
    router.push(
      `/orders/${orderId}/process?userId=${userId}&distance=${distance}`,
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://as1.ftcdn.net/v2/jpg/08/65/54/64/1000_F_865546440_feHvE9ohNV0RaFAdYWs9vk4IEOYPPh6b.jpg")',
      }}
    >
      <LogoutWorker />
      <header className="mt-4 bg-white bg-opacity-80 text-black py-5 shadow-xl rounded-lg">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
            Outlet Dashboard
          </h1>
          <p className="text-lg mt-2 font-medium text-black">
            Manage your orders and outlet details effortlessly
          </p>
        </div>
      </header>

      <main className="container mx-auto py-10 px-6">
        {outlet ? (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-8 border-b pb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {outlet.outletName}!
              </h2>
              <p className="text-gray-500 mt-2">Email: {outlet.outletEmail}</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Orders</h3>
            {orders.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Order ID:</span>{' '}
                        {order.id}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Status:</span>{' '}
                        {order.status}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Pickup Schedule:</span>{' '}
                        {new Date(order.pickupSchedule).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Total Items:</span>{' '}
                        {order.totalItems}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Total Price:</span> $
                        {order.totalPrice
                          ? order.totalPrice.toFixed(2)
                          : '0.00'}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Payment Status:</span>{' '}
                        {order.paymentStatus}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Distance:</span>{' '}
                        {order.pickupDeliveryRequests[0]?.distance || 0} km
                      </p>
                    </div>

                    {order.status === 'arrived_at_outlet' && (
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-4 rounded-lg">
                        <p className="text-yellow-800 font-medium">
                          ⚠️ This order needs to be processed
                        </p>
                        <button
                          onClick={() =>
                            handleProcessOrder(
                              order.id,
                              order.userId,
                              order.pickupDeliveryRequests[0]?.distance || 0,
                            )
                          }
                          className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                          Process Order
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No orders found for this outlet.</p>
            )}
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
          </div>
        )}
      </main>
    </div>
  );
}
