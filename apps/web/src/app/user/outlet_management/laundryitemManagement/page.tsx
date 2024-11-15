// page.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getToken } from '@/lib/server';

interface LaundryItem {
  id: number;
  name: string;
  price: number;
}

const LaundryItemManagement: React.FC = () => {
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<LaundryItem>>({
    name: '',
    price: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/laundry-items`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch laundry items');
      const data = await response.json();
      if (Array.isArray(data.data)) setItems(data.data);
      else throw new Error('Invalid data format');
    } catch (error) {
      toast.error('No data available');
      console.error(error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (item?: LaundryItem) => {
    setEditingItem(item || { name: '', price: 0 });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem({ name: '', price: 0 });
  };

  const saveItem = async () => {
    try {
      const method = editingItem.id ? 'PUT' : 'POST';
      const url = editingItem.id
        ? `${apiUrl}/laundry-items/${editingItem.id}`
        : `${apiUrl}/laundry-items`;
      const token = await getToken();

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.toString()}`,
        },
        body: JSON.stringify(editingItem),
      });

      const updatedItem = await response.json();

      if (editingItem.id) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingItem.id ? updatedItem : item,
          ),
        );
        toast.success('Item updated successfully');
      } else {
        setItems((prev) => [...prev, updatedItem]);
        toast.success('Item created successfully');
      }

      closeModal();
      fetchItems();
    } catch (error) {
      toast.error('Failed to save item');
      console.error(error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/laundry-items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');

      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
      console.error(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center my-8 text-blue-900">
        Laundry Item Management
      </h1>

      <div className="flex justify-between items-center mx-8 mb-4">
        <input
          type="text"
          placeholder="Search by item name"
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => openModal()}
          className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
        >
          <FaPlus className="mr-2" />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto mx-8 shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-left">
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Item Name
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                Price
              </th>
              <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wide text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="py-4 px-6 text-gray-800 font-medium">
                  {item.name}
                </td>
                <td className="py-4 px-6 text-gray-800">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-center space-x-2">
                  <button
                    onClick={() => openModal(item)}
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
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
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem.id ? 'Edit Item' : 'Add Item'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={editingItem.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={editingItem.price || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
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

export default LaundryItemManagement;
