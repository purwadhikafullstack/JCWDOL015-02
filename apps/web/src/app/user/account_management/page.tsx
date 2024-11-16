'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaEdit, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';

const AccountManagement = () => {
  const [users, setUsers] = useState<
    Array<{
      id: number;
      username: string;
      email: string;
      role: string;
      avatar: string;
    }>
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id?: number;
    username: string;
    email: string;
    password?: string;
    role: string;
    workerRole?: string;
    avatar?: string;
  }>({ username: '', email: '', password: '', role: 'admin' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // Default filter to "All"

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      // Pastikan data yang diterima adalah array
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (user?: typeof editingUser) => {
    if (user) {
      setEditingUser(user);
    } else {
      // Reset data ketika membuka modal untuk menambah pengguna baru
      setEditingUser({ username: '', email: '', password: '', role: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser({ username: '', email: '', password: '', role: '' });
  };

  const saveUser = async () => {
    try {
      // Tentukan method HTTP yang digunakan (PUT jika sudah ada id, POST jika baru)
      const method = editingUser.id ? 'PUT' : 'POST';
      const url = editingUser.id
        ? `${apiUrl}/users/${editingUser.id}`
        : `${apiUrl}/users/register`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser), // Pastikan data sesuai format backend
      });

      // if (!response.ok) {
      //   // const text = await response.text();
      //   const res = response.json();
      //   throw new Error(`Failed to save user: ${response}`);
      // }

      const user = await response.json();

      if (editingUser.id) {
        // Update data pengguna dalam list
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === editingUser.id ? { ...u, ...editingUser } : u,
          ),
        );
        toast.success('User updated successfully');
      } else {
        // Menambahkan pengguna baru ke dalam list
        setUsers((prev) => [...prev, user]);
        toast.success('User created successfully');
      }

      // Menutup modal setelah penyimpanan selesai
      closeModal();
      fetchUsers();
    } catch (error) {
      toast.error((error as Error).message);
      console.error('Error saving user:', error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  // Filter users based on both searchQuery and selectedFilter
  const filteredUsers = users
    .filter(
      (user) =>
        user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.role?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((user) => {
      if (selectedFilter === 'All') return true;
      return user.role === selectedFilter;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8  text-gray-800">
        User Management
      </h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by username, email or role"
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none bg-white text-gray-700 focus:border-blue-500"
        />
        <div className="flex items-center space-x-4">
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-lg focus:outline-none bg-white text-gray-700 focus:border-blue-500"
          >
            <option value="All">All</option>
            <option value="admin">admin</option>
            <option value="worker">worker</option>
            <option value="driver">driver</option>
            <option value="customer">customer</option>
          </select>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
          >
            <FaPlus className="mr-2" />
            Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-left">
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Profile
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Username
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Email
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Role
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="py-4 px-6">
                  <Image
                    src={user.avatar || '/default-avatar.png'}
                    alt={`${user.username}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </td>
                <td className="py-4 px-6 text-gray-800 font-medium">
                  {user.username}
                </td>
                <td className="py-4 px-6 text-gray-600">{user.email}</td>
                <td className="py-4 px-6 text-gray-600">{user.role}</td>
                <td className="py-4 px-6 text-center space-x-2">
                  <button
                    onClick={() => openModal(user)}
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
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

      {/* Modal for adding/editing user */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-6">
              {editingUser.id ? 'Edit User' : 'Add User'}
            </h2>
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={editingUser.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={editingUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    value={editingUser.password || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-3 text-gray-600"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={editingUser.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="admin">admin</option>
                  <option value="worker">worker</option>
                  <option value="driver">driver</option>
                </select>
              </div>
              {editingUser.role === 'worker' ? (
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium">
                    Worker Role
                  </label>
                  <select
                    id="workerRole"
                    name="workerRole"
                    value={editingUser.workerRole}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black"
                    required
                  >
                    <option value="" disabled>
                      Select Worker Role
                    </option>
                    <option value="washer">washer</option>
                    <option value="iron">iron</option>
                    <option value="dryer">dryer</option>
                  </select>
                </div>
              ) : null}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveUser}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {editingUser.id ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
