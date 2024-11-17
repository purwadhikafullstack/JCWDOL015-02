'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  setOrders,
  setError,
  setLoading,
  clearLoading,
} from '@/redux/slices/orderSlice';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/server';
import OrderList from '@/components/(order-management)/ordermanagement/OrderList';
import OrderFilter from '@/components/(order-management)/ordermanagement/OrderFilter';
import OrderCreateForm from '@/components/(order-management)/ordermanagement/OrderCreateForm';
import BypassRequestApproval from '@/components/(order-management)/ordermanagement/BypassRequestApproval';
import BypassRequestForm from '@/components/(order-management)/ordermanagement/BypassRequestForm';
import LoadingSpinner from '@/components/(order-management)/ordermanagement/LoadingSpinner';
import ErrorAlert from '@/components/(order-management)/ordermanagement/ErrorAlert';

const OrderManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: any) => state.order.orders);
  const loading = useSelector((state: any) => state.order.loading);
  const error = useSelector((state: any) => state.order.error);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const token = getToken();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!apiUrl) {
        dispatch(setError('API URL is not defined'));
        return;
      }

      dispatch(setLoading());

      try {
        const response = await fetch(`${apiUrl}/order`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

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
  }, [apiUrl, token, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Order Management
      </h1>

      {/* Error and Loading State */}
      {loading && <LoadingSpinner message="Loading orders..." />}
      {error && <ErrorAlert message={error} />}

      {/* Create Form */}
      <OrderCreateForm />

      {/* Filter Section */}
      <div className="mt-8">
        <OrderFilter onFilterChange={(filters) => console.log(filters)} />
      </div>

      {/* Bypass Request Form */}
      <div className="mt-8">
        <BypassRequestForm orderId={1} workerId={101} />
      </div>

      {/* Bypass Request Approval */}
      <div className="mt-8">
        <BypassRequestApproval requestId={1} initialStatus="PENDING" />
      </div>

      {/* Order List */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
          Order List
        </h2>
        <OrderList orders={orders} />
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
