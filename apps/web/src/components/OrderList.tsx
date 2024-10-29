import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../redux/orderSlice';
import { AppDispatch, RootState } from '../redux/store';

export const OrderList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div>
      <h2>Order List</h2>
      {orders.length > 0 ? (
        orders.map((order: any) => (
          <div key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Title: {order.title}</p>
            <p>Status: {order.status}</p>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};
