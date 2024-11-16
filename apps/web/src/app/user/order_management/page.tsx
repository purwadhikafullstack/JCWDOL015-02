'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setError, setLoading, setOrders } from '@/redux/slices/orderSlice';
import { Order, OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { useRouter } from 'next/navigation'; // This hook must be used in a client component
import BtnOrderDate from '@/components/(orders)/(detail-order)/BtnOrderDate';
import BtnOrderId from '@/components/(orders)/(detail-order)/BtnOrderId';
import SearchOrder from '@/components/(orders)/(detail-order)/SearchOrder';
import { OrderStatus } from '@/type/orderStatus'; // Assuming this is your custom type
import CreateOrderPage from '@/components/(orders)/(create)/Create'; // Import CreateOrderPage

const OrderManagement = () => {
  const dispatch = useDispatch();
  const {
    orders = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.order);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for opening the modal
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  // Effect to fetch orders on page load or filter change
  useEffect(() => {
    dispatch(setLoading(true));
    fetchOrders();
  }, [dispatch, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${apiUrl}/order?status=${statusFilter}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      const data: {
        id: number;
        status: PrismaOrderStatus;
        userId: number;
        addressId: number;
        outletId: number;
        package: string | null;
        pickupSchedule: Date;
        totalWeight: number | null;
        totalItems: number;
        createdAt: Date;
        updatedAt: Date;
      }[] = await response.json();

      const formattedData = data.map((item) => ({
        ...item,
        status: item.status as OrderStatus,
      }));
      dispatch(setOrders(formattedData));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle the filter status change from SearchOrder
  const handleSubmitSearch = (values: any) => {
    setStatusFilter(values.status); // Set filter status based on search input
  };

  // Modal content for creating a new order
  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Order Management
      </h1>

      {/* Search Order */}
      <div className="mb-4">
        <SearchOrder
          handleSubmitSearch={handleSubmitSearch}
          isLoading={loading}
          selectSearchModal={
            document.getElementById('modal_search_order') as HTMLDialogElement
          }
          byIdModal={
            document.getElementById('modal_by_id') as HTMLDialogElement
          }
          byDateModal={
            document.getElementById('modal_by_date') as HTMLDialogElement
          }
        />
        {/* Button to create a new order */}
        <button
          onClick={handleOpenModal} // Open modal when clicked
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Order
        </button>
      </div>

      {/* Display Orders */}
      {!loading && !error && (
        <div className="mt-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="p-4 border-b">Order ID</th>
                <th className="p-4 border-b">Package</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Outlet</th>
                <th className="p-4 border-b">Total Weight</th>
                <th className="p-4 border-b">Created At</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-4 border-b">{order.id}</td>
                    <td className="p-4 border-b">{order.package}</td>
                    <td className="p-4 border-b">{order.status}</td>
                    <td className="p-4 border-b">{order.outletId}</td>
                    <td className="p-4 border-b">{order.totalWeight}</td>
                    <td className="p-4 border-b">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 border-b">
                      <button
                        onClick={() =>
                          router.push(`/order-management/detail/${order.id}`)
                        }
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Modal to create new order */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <CreateOrderPage />
            <button
              onClick={handleCloseModal} // Close modal when clicked
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
