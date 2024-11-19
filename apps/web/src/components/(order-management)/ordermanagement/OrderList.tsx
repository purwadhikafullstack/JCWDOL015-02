import React from 'react';

type OrderItem = {
  id: number;
  name: string;
  status: string;
  bypassApproved: boolean;
};

type Order = {
  outletId: string;
  id: number;
  status: string;
  order_items: OrderItem[];
};

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: number, newStatus: string) => void;
  onBypassRequest: (orderId: number, itemId: number, approve: boolean) => void;
  filters: {
    status: string;
    outlet: string;
  };
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onStatusChange,
  onBypassRequest,
  filters,
}) => {
  const filteredOrders = orders.filter(
    (order) =>
      (filters.status ? order.status === filters.status : true) &&
      (filters.outlet ? order.outletId === filters.outlet : true),
  );

  return (
    <div>
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <div key={order.id} className="border-b border-gray-200 py-4">
            <h3 className="font-bold text-lg">Order #{order.id}</h3>
            <p>Status: {order.status}</p>

            {/* Order Items */}
            {order.order_items.map((item) => (
              <div key={item.id} className="mt-2">
                <p>{item.name}</p>
                <p>Status: {item.bypassApproved ? 'Approved' : 'Pending'}</p>
                <div>
                  <button
                    className="btn btn-success"
                    onClick={() => onBypassRequest(order.id, item.id, true)}
                  >
                    Approve Item
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => onBypassRequest(order.id, item.id, false)}
                  >
                    Reject Item
                  </button>
                </div>
              </div>
            ))}

            {/* Status Update */}
            <div className="mt-4">
              <button
                className="btn btn-primary"
                onClick={() => onStatusChange(order.id, 'Completed')}
              >
                Mark as Completed
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No orders match the selected filters.</p>
      )}
    </div>
  );
};

export default OrderList;
