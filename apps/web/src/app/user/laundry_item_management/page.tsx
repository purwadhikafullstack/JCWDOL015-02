'use client';
import { useState, useEffect } from 'react';
import LaundryItemForm from '@/components/(outlets)/laundryItemForm'; // Pastikan path ini benar sesuai struktur folder Anda
import { getToken } from '@/lib/server';

const LaundryItemManagement = () => {
  const [laundryItems, set] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State untuk mengontrol modal

  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  // Mengambil daftar item laundry dari server
  useEffect(() => {
    const fetchLaundryItemManagement = async () => {
      try {
        const response = await fetch(`${apiUrl}/laundryitems`);
        const data = await response.json();
        set(data);
      } catch (error) {
        console.error('Error fetching laundry items:', error);
      }
    };

    fetchLaundryItemManagement();
  }, [apiUrl]);

  const handleAddItem = async (newItem: {
    name: string;
    description: string;
    price: number;
  }) => {
    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/laundryitems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        set((prevItems) => [...prevItems, data]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding laundry item:', error);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item); // Mengatur item yang akan diedit
    setIsModalOpen(true); // Membuka modal untuk editing
  };

  const handleSaveChanges = async (updatedItem: {
    name: string;
    description: string;
    price: number;
  }) => {
    if (editingItem) {
      try {
        const response = await fetch(
          `${apiUrl}/laundryitems/${editingItem.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
          },
        );
        const data = await response.json();
        set((prevItems) =>
          prevItems.map((item) => (item.id === data.id ? data : item)),
        ); // Memperbarui daftar dengan data yang sudah diperbarui
        setEditingItem(null); // Menonaktifkan mode edit
        setIsModalOpen(false); // Menutup modal setelah menyimpan perubahan
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await fetch(`${apiUrl}/laundryitems/${itemId}`, {
        method: 'DELETE',
      });
      set((prevItems) => prevItems.filter((item) => item.id !== itemId)); // Menghapus item dari daftar
    } catch (error) {
      console.error('Error deleting laundry item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8  text-gray-800">
        Laundry Item Management
      </h1>

      {/* Tombol untuk membuka modal form */}
      <button
        onClick={() => {
          setEditingItem(null); // Reset item yang sedang diedit
          setIsModalOpen(true); // Membuka modal untuk menambah item
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Item
      </button>

      {/* Modal untuk Tambah/Edit Laundry Item */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <LaundryItemForm
              onSave={editingItem ? handleSaveChanges : handleAddItem}
              initialData={editingItem}
            />
            <button
              onClick={() => setIsModalOpen(false)} // Menutup modal
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Daftar Laundry Items */}
      <ul className="space-y-4 mt-8">
        {laundryItems.length > 0 &&
          laundryItems?.map((item) => (
            <li key={item.id} className="p-4 border rounded-lg bg-gray-50">
              <p>
                <strong>{item.name}</strong>
              </p>
              <p>
                Price:{' '}
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(item.price)}
              </p>
              <p>Description: {item.description}</p>
              <button
                onClick={() => handleEditItem(item)}
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LaundryItemManagement;
