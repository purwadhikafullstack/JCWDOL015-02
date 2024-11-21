'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { OutletWorker } from '@/type/worker/workerType'; // Pastikan tipe ini sudah didefinisikan dengan benar
import Link from 'next/link';

const OutletWorkersPage = () => {
  const [outletWorkers, setOutletWorkers] = useState<OutletWorker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<OutletWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOutletWorkers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/outlet-workers',
        );
        if (Array.isArray(response.data)) {
          setOutletWorkers(response.data);
          setFilteredWorkers(response.data);
        } else {
          throw new Error('Data format is incorrect, expected an array');
        }
      } catch (err) {
        setError('Failed to fetch outlet workers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOutletWorkers();
  }, []);

  useEffect(() => {
    const results = outletWorkers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.outletId.toString().includes(searchTerm),
    );
    setFilteredWorkers(results);
  }, [searchTerm, outletWorkers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div
      className="p-5 font-sans min-h-screen"
      style={{
        backgroundImage:
          "url('https://keranji.id/storage/artikel/content/828-Desain-Toko-Laundry-Minimalis-4.jpg'), url('https://keranji.id/storage/artikel/content/828-Desain-Toko-Laundry-Minimalis-4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Workers</h1>

      <div className="flex justify-center mb-8">
        <Link
          href="/admin"
          className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Go to Dashboard
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full max-w-md bg-white bg-opacity-90"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {worker.name}
              </h2>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Role:</strong> {worker.role}
                </p>
                <p>
                  <strong>Email:</strong> {worker.email}
                </p>
                <p>
                  <strong>Outlet ID:</strong> {worker.outletId}
                </p>
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(worker.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{' '}
                  {new Date(worker.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">
            No outlet workers found
          </p>
        )}
      </div>
    </div>
  );
};

export default OutletWorkersPage;
