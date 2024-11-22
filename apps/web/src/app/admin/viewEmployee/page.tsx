'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Type Definitions
interface Outlet {
  id: number;
  name: string;
  password: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface OutletWorker {
  outlet: any;
  id: number;
  outletId: Outlet | null;
  name: string;
  password: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const OutletWorkers = () => {
  const [outletWorkers, setOutletWorkers] = useState<OutletWorker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<OutletWorker[]>([]);
  const [outletFilter, setOutletFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [dateFilterType, setDateFilterType] = useState<
    'day' | 'month' | 'year'
  >('day');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<OutletWorker[]>(
          'http://localhost:8000/api/outlet-workers/',
        );
        setOutletWorkers(response.data);
        setFilteredWorkers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error fetching outlet workers');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const getOutletName = (outlet: Outlet | null) => {
    return outlet?.name || 'N/A';
  };

  const handleFilter = () => {
    let filtered = [...outletWorkers];

    if (outletFilter) {
      const searchKeyword = outletFilter.toLowerCase();
      filtered = filtered.filter((order) => {
        const outletName = order.outlet?.name?.toLowerCase() || '';
        return outletName.indexOf(searchKeyword) !== -1;
      });
    }

    if (dateFilter) {
      filtered = filtered.filter((worker) => {
        const workerDate = new Date(worker.createdAt);
        let formattedDate = '';
        switch (dateFilterType) {
          case 'day':
            formattedDate = workerDate.toISOString().split('T')[0];
            return formattedDate === dateFilter;
          case 'month':
            formattedDate = `${workerDate.getFullYear()}-${String(workerDate.getMonth() + 1).padStart(2, '0')}`;
            return formattedDate === dateFilter;
          case 'year':
            formattedDate = `${workerDate.getFullYear()}`;
            return formattedDate === dateFilter;
          default:
            return false;
        }
      });
    }

    setFilteredWorkers(filtered);
  };

  const handleReset = () => {
    setOutletFilter('');
    setDateFilter('');
    setDateFilterType('day');
    setFilteredWorkers(outletWorkers);
  };

  const renderDateInput = () => {
    if (dateFilterType === 'year') {
      return (
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full bg-white text-gray-800 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Year</option>
          {new Array(50).fill(null).map((_, index) => {
            const year = new Date().getFullYear() - index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      );
    } else if (dateFilterType === 'month') {
      return (
        <input
          type="month"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full bg-white text-gray-800 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    } else {
      return (
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full bg-white text-gray-800 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{
        backgroundImage:
          'url("https://keranji.id/storage/artikel/content/828-Desain-Toko-Laundry-Minimalis-4.jpg")',
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">
          Employee Performance Report
        </h1>
        <div className="flex justify-center mb-8">
          <Link
            href="/admin"
            className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
        <div className="mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Filter by Outlet
            </label>
            <input
              type="text"
              placeholder="Enter Outlet Name"
              value={outletFilter}
              onChange={(e) => setOutletFilter(e.target.value)}
              className="w-full bg-white text-gray-800 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Filter by Date
            </label>
            {renderDateInput()}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Date Filter Type
            </label>
            <select
              value={dateFilterType}
              onChange={(e) =>
                setDateFilterType(e.target.value as 'day' | 'month' | 'year')
              }
              className="w-full bg-white text-gray-800 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="day">Per Day</option>
              <option value="month">Per Month</option>
              <option value="year">Per Year</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row items-end space-x-2 mt-4">
            <button
              onClick={handleFilter}
              className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="w-full md:w-auto bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 mt-4">Loading...</p>
        ) : error ? (
          <p className="text-red-600 mt-4">{error}</p>
        ) : filteredWorkers.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Outlet</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Role</th>
                  <th className="border border-gray-300 px-4 py-2">Created</th>
                  <th className="border border-gray-300 px-4 py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {worker.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {getOutletName(worker.outlet)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {worker.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {worker.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {worker.createdAt}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {worker.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No workers found.</p>
        )}
      </div>
    </div>
  );
};

export default OutletWorkers;
