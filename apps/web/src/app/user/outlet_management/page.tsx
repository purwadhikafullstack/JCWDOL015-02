// page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaTrashAlt, FaEdit, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { getToken } from '@/lib/server';
import MyMap from '@/components/(map)/Map';
import CreateAddress from '@/components/(profile)/CreateAddress';
import AddressComp from '@/components/(profile)/AddressComp';
interface Outlet {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  lon?: number;
  lat?: number;
  address?: string;
}

const OutletManagement: React.FC = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [outletId, setOutletId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Partial<Outlet>>({
    name: '',
    email: '',
    password: '',
    lon: undefined,
    lat: undefined,
    address: undefined,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Outlet Management');

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [position, setPosition] = useState<[number, number]>([
    -6.2088, 106.8456,
  ]); // Initial position
  const [address, setAddress] = useState<string>('');

  const handlePositionChange = (
    newPosition: [number, number],
    newAddress: string,
  ) => {
    setPosition(newPosition); // Update position from child component
    setAddress(newAddress);
    console.log(position, 'position');
    console.log(address, 'address');
  };
  const fetchOutlets = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/outlet`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch outlets');
      const data = await response.json();
      if (Array.isArray(data.data)) setOutlets(data.data);
      else throw new Error('Invalid data format');
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
    const obj: Partial<Outlet> = {};
    if (position) {
      obj.lon = position[0];
      obj.lat = position[1];
      obj.address = address;
    }

    setEditingOutlet((prev) => ({ ...prev, ...obj, [name]: value }));
  };

  const openModal = (outlet?: Outlet) => {
    let newOutlets = { ...outlet };
    if (newOutlets.lat !== undefined) {
      newOutlets.lat = parseFloat(String(newOutlets.lat));
      newOutlets.lon = parseFloat(String(newOutlets.lon));
    }
    setOutletId(newOutlets.id || null);

    setEditingOutlet(
      newOutlets || {
        name: '',
        email: '',
        password: '',
        lon: undefined,
        lat: undefined,
        address: '',
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
      lon: undefined,
      lat: undefined,
      address: '',
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const saveOutlet = async () => {
    try {
      const method = editingOutlet.id ? 'PUT' : 'POST';
      const url = editingOutlet.id
        ? `${apiUrl}/outlet/id/${editingOutlet.id}`
        : `${apiUrl}/outlet/register`;
      const token = await getToken();
      const payload = {
        ...editingOutlet,
        address: address, // Pastikan address ditambahkan ke payload
        lon: position[0], // Pastikan lon juga diperbarui
        lat: position[1], // Pastikan lat juga diperbarui
      };
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.toString()}`,
        },
        body: JSON.stringify(payload),
        method,
      });

      if (editingOutlet.id) {
        const updatedOutlet = await response.json();
        setOutlets((prevOutlets) =>
          prevOutlets.map((o) =>
            o.id === editingOutlet.id ? updatedOutlet : o,
          ),
        );
        toast.success('Outlet updated successfully!');
      } else {
        const updatedOutlet = await response.json();
        setOutlets((prev) => [...prev, updatedOutlet]);
        toast.success('Outlet created successfully!');
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
      const response = await fetch(`${apiUrl}/outlet/id/${id}`, {
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

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.email?.toLocaleLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {selectedMenu}
        </h1>

        {selectedMenu === 'Outlet Management' && (
          <div>
            <div className="flex bg-white justify-between items-center mb-4 p-2">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={handleSearch}
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none bg-white text-gray-700 focus:border-blue-500"
              />
              <button
                onClick={() => openModal()}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
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
                      <td className="py-4 px-6 text-gray-800">
                        {outlet.email}
                      </td>
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

            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 w-1/2">
                  <h2 className="text-2xl font-bold mb-4">
                    {editingOutlet.id ? 'Edit Outlet' : 'Add Outlet'}
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={editingOutlet.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-700"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={editingOutlet.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-700"
                    />
                    <div className="relative mb-10">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={editingOutlet.password || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-700"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {editingOutlet.address && (
                      <textarea
                        disabled
                        name="name"
                        placeholder="Name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-700"
                      >
                        {editingOutlet.address}
                      </textarea>
                    )}
                    {editingOutlet.id ? (
                      // <CreateAddress outletId={editingOutlet.id} />
                      <AddressComp outletId={outletId} />
                    ) : null}
                    {/* <MyMap
                      position={position}
                      address={address}
                      onPositionChange={handlePositionChange}
                    /> */}
                  </div>
                  <div className="flex justify-end mt-6 space-x-2">
                    <button
                      onClick={closeModal}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveOutlet}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutletManagement;
