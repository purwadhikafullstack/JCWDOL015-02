'use client';

import { getToken } from '@/lib/server';
import { useState, useEffect } from 'react';
import Select from 'react-select';

const AssignManagement = () => {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const fetchOutletsAssign = async () => {
    try {
      const response = await fetch(`${apiUrl}/outlet`);
      const data = await response.json();
      const filtereOutlets = data.data.filter(
        (item: { isAssign: string }) => item.isAssign != null,
      );
      setAssignedUsers(filtereOutlets);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch(`${apiUrl}/outlet`);
        const data = await response.json();
        const filtereOutlets = data.data.filter(
          (item: { isAssign: string }) => item.isAssign == null,
        );
        setOutlets(filtereOutlets);
      } catch (error) {
        console.error('Error fetching outlets:', error);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${apiUrl}/users`);
        const data = await response.json();
        const filtereAdmins = data.filter(
          (item: { role: string; outletId: number }) =>
            item.role === 'admin' && item.outletId == null,
        );
        setAdmins(filtereAdmins);
      } catch (error) {
        console.error('Error fetching Admins:', error);
      }
    };

    fetchOutlets();
    fetchAdmins();
    fetchOutletsAssign();
  }, [apiUrl]);

  // Fungsi untuk mengambil daftar pekerja saat select dibuka
  const handleOpenWorkerSelect = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/workers`);
      const data = await response.json();
      setWorkers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };
  const handleOpenDriverSelect = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/drivers`);
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const handleAssignRole = async () => {
    if (selectedOutlet && selectedWorker.length > 0) {
      try {
        const token = await getToken();
        const response = await fetch(`${apiUrl}/outlet-assignment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            outletId: selectedOutlet,
            admins: selectedAdmin,
            workers: selectedWorker,
            drivers: selectedDriver,
          }),
        });
        // const data = await response.json();
        fetchOutletsAssign();
        setOutlets([]);
        setAdmins([]);
        setWorkers([]);
        setDrivers([]);
        // setAssignedUsers((prevUsers) => [...prevUsers, ...data]);
      } catch (error) {
        console.error('Error assigning role:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800">Assign Management</h2>

      {/* Form untuk menugaskan peran */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Assign Employee to Outlet</h3>
        <div className="mt-4">
          <label className="block text-gray-700">Select Outlet</label>
          <select
            value={selectedOutlet || ''}
            onChange={(e) => setSelectedOutlet(Number(e.target.value))}
            className="mt-2 bg-white block w-full p-2 border rounded-md"
          >
            <option disabled value="">
              Select an Outlet
            </option>
            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Select Admin Outlet</label>
          <select
            value={selectedAdmin || ''}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="mt-2 bg-white block w-full p-2 border rounded-md"
          >
            <option disabled value="">
              Select Admin Outlet
            </option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Select Worker(s)</label>
          <Select
            isMulti
            options={workers.map((worker) => ({
              value: worker.id,
              label: worker.username,
            }))}
            onChange={(selected) =>
              setSelectedWorker(
                selected ? selected.map((item: any) => item.value) : [],
              )
            }
            onMenuOpen={handleOpenWorkerSelect}
            placeholder="Select Workers"
            className="mt-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Select Driver(s)</label>
          <Select
            isMulti
            options={drivers.map((driver) => ({
              value: driver.id,
              label: driver.username,
            }))}
            onChange={(selected) =>
              setSelectedDriver(
                selected ? selected.map((item: any) => item.value) : [],
              )
            }
            onMenuOpen={handleOpenDriverSelect}
            placeholder="Select Drivers"
            className="mt-2"
          />
        </div>

        <button
          onClick={handleAssignRole}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Assign Role
        </button>
      </div>

      {/* Daftar Penugasan */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Outlet is Assigned</h3>
        <div className="mt-4">
          <ul className="space-y-4">
            {assignedUsers.map((user) => (
              <li key={user.id} className="p-4 border rounded-lg bg-gray-50">
                <p>
                  <strong>{user.name}</strong> ({user.role})
                </p>
                <p>Assigned to: {user.outletName}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssignManagement;
