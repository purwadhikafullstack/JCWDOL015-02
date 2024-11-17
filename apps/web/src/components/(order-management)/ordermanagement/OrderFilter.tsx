import React, { useState } from 'react';

interface OrderFilterProps {
  onFilterChange: (filters: { status: string; outlet: string }) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<string>('');
  const [outlet, setOutlet] = useState<string>('');

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleOutletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutlet(event.target.value);
  };

  const handleApplyFilters = () => {
    onFilterChange({ status, outlet });
  };

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        Filter Orders
      </h2>

      <div className="flex justify-between gap-4 mb-4">
        <div className="w-1/2">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Order Status
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        <div className="w-1/2">
          <label
            htmlFor="outlet"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Outlet
          </label>
          <select
            id="outlet"
            value={outlet}
            onChange={handleOutletChange}
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Outlet</option>
            <option value="outlet1">Outlet 1</option>
            <option value="outlet2">Outlet 2</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default OrderFilter;
