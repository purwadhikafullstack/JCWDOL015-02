'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Outlet } from '@/type/outlet';

const OutletsPage = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [filteredOutlets, setFilteredOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/outlet');

        if (Array.isArray(response.data.data)) {
          setOutlets(response.data.data);
          setFilteredOutlets(response.data.data);
        } else {
          throw new Error('Data format is incorrect');
        }
      } catch (err) {
        setError('Failed to fetch outlets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

  useEffect(() => {
    const results = outlets.filter(
      (outlet) =>
        outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outlet.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredOutlets(results);
  }, [searchTerm, outlets]);

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
      <h1 className="text-3xl font-bold text-center mb-8">Outlets</h1>

      {/* Dashboard Button */}
      <div className="flex justify-center mb-8">
        <Link
          href="/admin"
          className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full max-w-md bg-white bg-opacity-90"
        />
      </div>

      {/* Outlets Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredOutlets.map((outlet) => (
          <Link
            key={outlet.id}
            href={`/admin/${outlet.id}/updateOutlet`}
            className="block p-6 border border-gray-200 rounded-lg shadow-md bg-white bg-opacity-75 transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {outlet.name}
              </h2>
              <p className="text-gray-600">Email: {outlet.email}</p>
              <p className="text-gray-600">
                Created At: {new Date(outlet.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
        {filteredOutlets.length === 0 && (
          <p className="text-center text-gray-500 w-full">No outlets found</p>
        )}
      </div>
    </div>
  );
};

export default OutletsPage;
