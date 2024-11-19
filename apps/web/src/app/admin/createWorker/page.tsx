"use client";

import React, { useState } from "react";
import axios from "axios";

export default function CreateWorker() {
  const [formData, setFormData] = useState({
    outletId: 0,
    name: "",
    password: "",
    email: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "outletId" ? Number(value) : value, // Konversi ke number jika outletId
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/worker", formData);
      setMessage("Worker created successfully!");
      setFormData({
        outletId: 0,
        name: "",
        password: "",
        email: "",
        role: "",
      });
    } catch (error) {
      setMessage("Failed to create worker. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Worker</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label htmlFor="outletId" className="block text-gray-700 font-medium mb-2">
            Outlet ID
          </label>
          <input
            type="number"
            id="outletId"
            name="outletId"
            value={formData.outletId}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white"
            required
          >
            <option value="">Select Role</option>
            <option value="washer">Washer</option>
            <option value="ironer">Ironer</option>
            <option value="driver">Driver</option>
            <option value="packer">Packer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Worker
        </button>
      </form>
    </div>
  );
}
