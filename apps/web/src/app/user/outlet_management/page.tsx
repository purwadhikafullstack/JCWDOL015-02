'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import Image from 'next/image';

interface Outlet {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}

const OutletManagement: React.FC = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Partial<Outlet>>({
    name: '',
    email: '',
    password: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const fetchOutlets = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/outlet`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch outlets');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setOutlets(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      toast.error('No data available');
      console.error(error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchOutlets();
  }, [fetchOutlets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingOutlet((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (outlet?: Outlet) => {
    setEditingOutlet(
      outlet || {
        name: '',
        email: '',
        password: '',
      },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOutlet({
      name: '',
      email: '',
      password: '',
    });
  };

  const saveOutlet = async () => {
    try {
      const method = editingOutlet.id ? 'PUT' : 'POST';
      const url = editingOutlet.id
        ? `${apiUrl}/outlet/${editingOutlet.id}`
        : `${apiUrl}/outlet/register`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOutlet),
      });

      const updatedOutlet = await response.json();

      if (editingOutlet.id) {
        setOutlets((prevOutlet) =>
          prevOutlet.map((o) =>
            o.id === editingOutlet.id ? updatedOutlet : o,
          ),
        );
        toast.success('Outlet updated successfully');
      } else {
        setOutlets((prev) => [...prev, updatedOutlet]);
        toast.success('Outlet created successfully');
      }

      closeModal();
      fetchOutlets();
    } catch (error) {
      toast.error('Failed to save outlet');
      console.error(error);
    }
  };

  const deleteOutlet = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/outlet/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete outlet');

      setOutlets((prev) => prev.filter((outlet) => outlet.id !== id));
      toast.success('Outlet deleted successfully');
    } catch (error) {
      toast.error('Failed to delete outlet');
      console.error(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredOutlets = outlets.filter((outlet) =>
    outlet?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">
        Outlet Management
      </h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => openModal()}
          className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
        >
          <FaPlus className="mr-2" />
          Add Outlet
        </button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-left">
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Profile
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Name
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Email
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOutlets.map((outlet) => (
              <tr
                key={outlet.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="py-4 px-6">
                  <Image
                    src={outlet.avatar || '/default-avatar.png'}
                    alt={`${outlet.name} avatar`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </td>
                <td className="py-4 px-6 text-gray-800 font-medium">
                  {outlet.name}
                </td>
                <td className="py-4 px-6 text-gray-800">{outlet.email}</td>
                <td className="py-4 px-6 text-center space-x-2">
                  <button
                    onClick={() => openModal(outlet)}
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteOutlet(outlet.id)}
                    className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                  >
                    <FaTrashAlt className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding/editing outlet */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingOutlet.id ? 'Edit Outlet' : 'Add New Outlet'}
            </h2>
            <div>
              <label className="block mb-2 text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={editingOutlet.name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={editingOutlet.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={editingOutlet.password || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveOutlet}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletManagement;
