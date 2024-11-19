'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  setOrders,
  setError,
  setLoading,
  clearLoading,
} from '@/redux/slices/orderSlice';
import { getToken } from '@/lib/server';
import OrderList from '@/components/(order-management)/ordermanagement/OrderList';
import OrderFilter from '@/components/(order-management)/ordermanagement/OrderFilter';
import OrderCreateForm from '@/components/(order-management)/ordermanagement/OrderCreateForm';
import BypassRequestApproval from '@/components/(order-management)/ordermanagement/BypassRequestApproval';
import BypassRequestForm from '@/components/(order-management)/ordermanagement/BypassRequestForm';
import LoadingSpinner from '@/components/(order-management)/ordermanagement/LoadingSpinner';
import ErrorAlert from '@/components/(order-management)/ordermanagement/ErrorAlert';
import { FormEvent } from 'react';

const OrderManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: any) => state.order.orders);
  const loading = useSelector((state: any) => state.order.loading);
  const error = useSelector((state: any) => state.order.error);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const token = getToken();
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!apiUrl) {
        dispatch(setError('API URL is not defined'));
        return;
      }

      dispatch(setLoading());

      try {
        const response = await fetch(
          `${apiUrl}/order${selectedOutlet ? `?outlet=${selectedOutlet}` : ''}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        dispatch(setOrders(data));
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error ? error.message : 'Failed to fetch orders',
          ),
        );
      } finally {
        dispatch(clearLoading());
      }
    };

    fetchOrders();
  }, [apiUrl, token, selectedOutlet, dispatch]);

  const handleCreateOrder = async (e: FormEvent, orderData: any) => {
    if (!apiUrl) {
      dispatch(setError('API URL is not defined'));
      return;
    }

    dispatch(setLoading());

    try {
      const response = await fetch(`${apiUrl}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const newOrder = await response.json();
      dispatch(setOrders([...orders, newOrder]));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : 'Failed to create order',
        ),
      );
    } finally {
      dispatch(clearLoading());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Order Management
      </h1>

      {/* Error and Loading State */}
      {loading && <LoadingSpinner message="Loading orders..." />}
      {error && <ErrorAlert message={error} />}

      {/* Create Form */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-4">
        <OrderCreateForm onSubmit={handleCreateOrder} />
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center md:justify-between bg-white shadow-md rounded-lg p-4 mb-8">
        <OrderFilter
          onFilterChange={(filters) => setSelectedOutlet(filters.outlet)}
        />
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setSelectedOutlet(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Bypass Request Form */}
      <div className="mb-8">
        <BypassRequestForm orderId={1} workerId={101} />
      </div>

      {/* Bypass Request Approval */}
      <div className="mb-8">
        <BypassRequestApproval requestId={1} initialStatus="PENDING" />
      </div>

      {/* Order List */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
          Order List
        </h2>
        <OrderList
          orders={orders}
          onStatusChange={(orderId, newStatus) => {
            // Implement status change functionality
          }}
          onBypassRequest={(orderId, itemId, approve) => {
            // Implement bypass request functionality
          }}
          filters={{
            status: '',
            outlet: selectedOutlet || '',
          }}
        />
      </div>

      {/* No Orders Message at the Bottom */}
      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 14l2-2 4 4m0 0l4-4m-4 4V7"
            />
          </svg>
          <p className="text-gray-600 text-lg font-medium">No orders found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting the filter or creating a new order.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
