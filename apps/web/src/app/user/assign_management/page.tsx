'use client';

import { getToken } from '@/lib/server';
import {
  useState,
  useEffect,
  SetStateAction,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
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

  //   console.log(selectedAdmin, 'selectedAdmin');
  //   console.log(selectedDriver, 'selectedDriver');
  console.log(outlets, 'outlets');

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
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
      const filtereOutlets = data.data.filter(
        (item: { outlet: any; isAssign: string }) =>
          item.outlet.isAssign != null,
      );
      setAssignedUsers(filtereOutlets);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };
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
      let data = await response.json();
      let filtereAdmins;

      if (!isModalOpen) {
        data = data.filter(
          (item: { role: string; outletId: number }) =>
            item.role === 'admin' && item.outletId == null,
        );
      } else {
        data = data.filter(
          (item: { role: string; outletId: number }) => item.role === 'admin',
        );
      }
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching Admins:', error);
    }
  };
  useEffect(() => {
    // fetchOutlets();
    fetchOutletsAssign();
  }, [apiUrl]);

  // Fungsi untuk mengambil daftar pekerja saat select dibuka
  const handleOpenWorkerSelect = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/workers`);
      let res = await response.json();
      if (workers.length > 0 && isModalOpen) {
        const data = [...workers, ...res];
        setWorkers(data);
      } else {
        setWorkers(res);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };
  const handleOpenDriverSelect = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/drivers`);
      const res = await response.json();
      if (drivers.length > 0 && isModalOpen) {
        const data = [...drivers, ...res];
        setDrivers(data);
      } else {
        setDrivers(res);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const handleAssignRole = async () => {
    // if (selectedOutlet && selectedWorker.length > 0) {
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
      console.log(data, 'DATAAA');

      fetchOutletsAssign();
      setOutlets([]);
      setAdmins([]);
      setWorkers([]);
      setDrivers([]);
      if (isModalOpen) {
        setIsModalOpen(false);
      }
      toast.success('Successfully Update Assigned');
    } catch (error) {
      toast.error('Failed to Assign');
      console.error('Error assigning role:', error);
    }
    // }
  };

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
      if (data) {
        let ads: SetStateAction<any[]> = [];
        let w: SetStateAction<any[]> = [];
        let d: SetStateAction<any[]> = [];
        setAssignedUserDetail(data.outlet);
        data.user.forEach((element: any) => {
          if (element.role === 'admin') ads.push(element);
          if (element.role === 'worker') w.push(element);
          if (element.role === 'driver') d.push(element);
        });
        console.log(ads, 'ads');

        setSelectedOutlet(data.outlet.id);
        setWorkers(w);
        setSelectedWorker(w.map((item) => item.id));
        setDrivers(d);
        setSelectedDriver(d.map((item) => item.id));
        setAdmins(ads);
        setSelectedAdmin(ads.map((item) => item.id));
        // setSelectedAdmin(ads);
        console.log(selectedAdmin, 'selectedAdmin');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching Admins:', error);
    }
  };

  console.log(assignedUsers, 'assignedUsers');

  const closeModal = () => {
    setIsModalOpen(false);
    setAssignedUserDetail({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Assign Management
      </h2>

      {/* Form untuk menugaskan peran */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Assign Employee to Outlet</h3>
        <div className="mt-4">
          <label className="block text-gray-700">Select Outlet</label>
          <Select
            options={outlets.map((admin) => ({
              value: admin.id,
              label: admin.name,
            }))}
            onChange={(selected) =>
              setSelectedOutlet(selected ? selected.value : [])
            }
            onMenuOpen={fetchOutlets}
            placeholder="Select Outlets"
            className="mt-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Select Admin Outlet</label>
          {/* <select
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
          </select> */}
          <Select
            options={admins.map((admin) => ({
              value: admin.id,
              label: admin.username,
            }))}
            onChange={(selected) =>
              setSelectedAdmin(selected ? selected.value : [])
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

      {/* Daftar Penugasan */}
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
                    <p className="text-xl font-semibold text-blue-700">
                      {user.outlet.name}
                    </p>
                    <p className="text-gray-600">Assigned to:</p>
                  </div>
                  <button
                    className="px-5 py-2 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors shadow-md flex items-center"
                    onClick={() => handleEdit(user.outlet.id)}
                  >
                    <PencilIcon className="h-5 w-5 mr-2" /> {/* Icon Pen */}
                    Edit
                  </button>
                </div>

                {/* Admins Section */}
                {user.users.admins.length > 0 && (
                  <div className="mt-2">
                    <p className="text-lg font-medium text-gray-800">Admin:</p>
                    <ul className="list-disc ml-6 text-gray-700">
                      {user.users.admins.map(
                        (admin: {
                          id: Key | null | undefined;
                          username:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<AwaitedReactNode>
                            | null
                            | undefined;
                        }) => (
                          <li key={admin.id}>{admin.username}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Workers Section */}
                {user.users.workers.length > 0 && (
                  <div className="mt-4">
                    <p className="text-lg font-medium text-gray-800">
                      Worker(s):
                    </p>
                    <ul className="list-disc ml-6 text-gray-700">
                      {user.users.workers.map(
                        (worker: {
                          id: Key | null | undefined;
                          username:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<AwaitedReactNode>
                            | null
                            | undefined;
                        }) => (
                          <li key={worker.id}>{worker.username}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Drivers Section */}
                {user.users.drivers.length > 0 && (
                  <div className="mt-4">
                    <p className="text-lg font-medium text-gray-800">
                      Driver(s):
                    </p>
                    <ul className="list-disc ml-6 text-gray-700">
                      {user.users.drivers.map(
                        (driver: {
                          id: Key | null | undefined;
                          username:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<AwaitedReactNode>
                            | null
                            | undefined;
                        }) => (
                          <li key={driver.id}>{driver.username}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Assign</h2>
            <div className="space-y-4">
              <label className="block text-gray-700">Outlet</label>
              <input
                disabled
                type="text"
                name="name"
                placeholder="Name"
                value={assignedUserDetail?.name}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-200 text-gray-700"
              />
              <label className="block text-gray-700">Email Outlet</label>
              <input
                disabled
                type="email"
                name="email"
                placeholder="Email"
                value={assignedUserDetail?.email}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-200 text-gray-700"
              />
              {assignedUserDetail?.address && (
                <>
                  <label className="block text-gray-700">Address Outlet</label>
                  <textarea
                    disabled
                    name="name"
                    placeholder="Name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-200 text-gray-700"
                  >
                    {assignedUserDetail.address}
                  </textarea>
                </>
              )}
            </div>
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold">
                Update Assign Employee to Outlet
              </h3>

              <div className="mt-4">
                <label className="block text-gray-700">
                  Select Admin Outlet
                </label>
                {/* <select
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
                </select> */}
                <Select
                  options={admins.map((admin) => ({
                    value: admin.id,
                    label: admin.username,
                  }))}
                  defaultValue={
                    selectedAdmin.length > 0 // Kondisi jika modal terbuka
                      ? selectedAdmin
                          .map((adminId: any) => {
                            const admin = admins.find((w) => w.id === adminId);
                            return admin
                              ? { value: admin.id, label: admin.username }
                              : null;
                          })
                          .filter(Boolean)
                      : []
                  }
                  onChange={(selected) =>
                    setSelectedAdmin(selected ? selected.value : [])
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
                  defaultValue={
                    isModalOpen // Kondisi jika modal terbuka
                      ? selectedWorker
                          .map((workerId) => {
                            const worker = workers.find(
                              (w) => w.id === workerId,
                            );
                            return worker
                              ? { value: worker.id, label: worker.username }
                              : null;
                          })
                          .filter(Boolean)
                      : []
                  }
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
                  defaultValue={
                    isModalOpen // Kondisi jika modal terbuka
                      ? selectedDriver
                          .map((driverId) => {
                            const driver = drivers.find(
                              (w) => w.id === driverId,
                            );
                            return driver
                              ? { value: driver.id, label: driver.username }
                              : null;
                          })
                          .filter(Boolean) // Menghilangkan nilai `null`
                      : [] // Jika modal tidak terbuka, defaultValue kosong
                  }
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
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignRole}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
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

export default AssignManagement;
