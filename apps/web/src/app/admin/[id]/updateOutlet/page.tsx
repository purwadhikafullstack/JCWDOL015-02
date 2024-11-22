'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "@/type/outlet";
import { useParams, useRouter } from "next/navigation";

const UpdateOutletPage = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const router = useRouter();

  const [outlet, setOutlet] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchOutlet = async () => {
      try {
        const response = await axios.get<Outlet>(`http://localhost:8000/api/outlet/id/${id}`);
        setOutlet({
          name: response.data.name,
          password: "", // Password direset untuk keamanan
          email: response.data.email,
        });
      } catch (err) {
        setError("Failed to fetch outlet data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOutlet();
  }, [id]);

//  kirim token  useEffect(() => { 
//     const fetchOutlet = async () => {
//       const token = localStorage.getItem("superAdmin"); // Ambil token dari localStorage
//       if (!token) {
//         setError("Authorization token is missing. Please login again.");
//         setLoading(false);
//         return;
//       }
  
//       try {
//         const response = await axios.get<Outlet>(
//           `http://localhost:8000/api/outlet/id/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Tambahkan header Bearer Token
//             },
//           }
//         );
//         setOutlet({
//           name: response.data.name,
//           password: "", // Password direset untuk keamanan
//           email: response.data.email,
//         });
//       } catch (err) {
//         setError("Failed to fetch outlet data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchOutlet();
//   }, [id]);
  



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOutlet((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(`http://localhost:8000/api/outlet/id/${id}`, {
        name: outlet.name,
        password: outlet.password,
        email: outlet.email,
      });
      alert("Outlet updated successfully!");
      router.push("/outlets");
    } catch (err) {
      alert("Failed to update outlet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white min-h-[70vh] p-6">
      <h1 className="text-2xl font-bold mb-4">Update Outlet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={outlet.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={outlet.password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={outlet.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Outlet"}
        </button>
      </form>
    </div>
  );
};

export default UpdateOutletPage;
