'use client';

import { getToken } from '@/lib/server';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { PencilIcon } from '@heroicons/react/24/solid';

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
  const [assignedUserDetail, setAssignedUserDetail] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  // Fetch data for outlet assignments
  const fetchOutletsAssign = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/outlet-assignment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const filteredOutlets = data.data.filter(
        (item: { outlet: any; isAssign: string }) =>
          item.outlet.isAssign != null,
      );
      setAssignedUsers(filteredOutlets);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  // Fetch available outlets for assignment
  const fetchOutlets = async () => {
    try {
      const response = await fetch(`${apiUrl}/outlet`);
      const data = await response.json();
      const filteredOutlets = data.data.filter(
        (item: { isAssign: string }) => item.isAssign == null,
      );
      setOutlets(filteredOutlets);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  // Fetch available admins for assignment
  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${apiUrl}/users`);
      let data = await response.json();
      const filteredAdmins = data.filter(
        (item: { role: string; outletId: number }) =>
          item.role === 'admin' && item.outletId == null,
      );
      setAdmins(filteredAdmins);
    } catch (error) {
      console.error('Error fetching Admins:', error);
    }
  };

  // Fetch workers data when select menu opens
  const handleOpenWorkerSelect = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/workers`);
      const res = await response.json();
      setWorkers(res);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  // Fetch drivers data when select menu opens
  const handleOpenDriverSelect = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/users/drivers/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Driver Data Response:', data);
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  // Assign roles to an outlet
  const handleAssignRole = async () => {
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
      const data = await response.json();
      fetchOutletsAssign();
      setOutlets([]);
      setAdmins([]);
      setWorkers([]);
      setDrivers([]);
      if (isModalOpen) {
        setIsModalOpen(false);
      }
      toast.success('Successfully Assigned');
    } catch (error) {
      toast.error('Failed to Assign');
      console.error('Error assigning role:', error);
    }
  };

  // Edit the assignment of roles for a specific outlet
  const handleEdit = async (id?: number) => {
    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/outlet-assignment/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAssignedUserDetail(data.outlet);
      setSelectedOutlet(data.outlet.id);
      setAdmins(data.users.admins);
      setWorkers(data.users.workers);
      setDrivers(data.users.drivers);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching assignment data:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAssignedUserDetail({});
  };

  useEffect(() => {
    fetchOutletsAssign();
    fetchOutlets();
    fetchAdmins();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Assign Management
      </h2>

      {/* Assignment form */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Assign Employee to Outlet</h3>
        <div className="mt-4">
          <label className="block text-gray-700">Select Outlet</label>
          <Select
            options={outlets.map((outlet) => ({
              value: outlet.id,
              label: outlet.name,
            }))}
            onChange={(selected) =>
              setSelectedOutlet(selected ? selected.value : null)
            }
            onMenuOpen={fetchOutlets}
            placeholder="Select Outlet"
            className="mt-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Select Admin Outlet</label>
          <Select
            options={admins.map((admin) => ({
              value: admin.id,
              label: admin.username,
            }))}
            onChange={(selected) =>
              setSelectedAdmin(selected ? selected.value : null)
            }
            onMenuOpen={fetchAdmins}
            placeholder="Select Admin"
            className="mt-2"
          />
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

      {/* Assigned users list */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Outlet Assignments
        </h3>
        <div className="mt-4">
          <ul className="space-y-6">
            {assignedUsers.map((user) => (
              <li
                key={user.outlet.id}
                className="p-5 border rounded-lg bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-sm transition-transform transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-blue-700">
                      {user.outlet.name}
                    </h4>
                    <p className="text-gray-600">
                      {user.outlet.isAssign ? 'Assigned' : 'Not Assigned'}
                    </p>
                    {user.outlet.isAssign && (
                      <div className="mt-4">
                        {/* Admins */}
                        {user.admins && user.admins.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold text-gray-700">
                              Admin:
                            </p>
                            {user.admins.map((admin: any) => (
                              <p key={admin.id} className="text-gray-600">
                                {admin.username}
                              </p>
                            ))}
                          </div>
                        )}
                        {/* Workers */}
                        {user.workers && user.workers.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold text-gray-700">
                              Workers:
                            </p>
                            <ul>
                              {user.workers.map((worker: any) => (
                                <li key={worker.id} className="text-gray-600">
                                  {worker.username}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Drivers */}
                        {user.drivers && user.drivers.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold text-gray-700">
                              Drivers:
                            </p>
                            <ul></ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(user.outlet.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for editing assignments */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-3/4">
            <h3 className="text-xl font-semibold mb-6">
              Edit Outlet Assignment
            </h3>
            <div>
              {/* Outlet name and admins form here */}
              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignManagement;
