"use client";

import React, { useState } from "react";
import axios from "axios";

export default function CreateOutlet() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/outlet", formData);
      setMessage("Outlet created successfully!");
      setFormData({
        name: "",
        password: "",
        email: "",
      });
    } catch (error) {
      setMessage("Failed to create outlet. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Create Outlet</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Outlet
        </button>
      </form>
    </div>
  );
}
