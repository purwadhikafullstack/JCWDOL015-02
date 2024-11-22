'use client';

import Link from "next/link";

const AdminPage = () => {
  return (
    <div className="bg-white min-h-[70vh] p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-4">
        {/* Button for Create Outlet */}
        <Link href="/admin/createOutlet">
          <button className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Create Outlet
          </button>
        </Link>

        {/* Button for Create Worker */}
        <Link href="/admin/createWorker">
          <button className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Create Worker
          </button>
        </Link>

        {/* Button for View Outlets */}
        <Link href="/admin/viewOutlet">
          <button className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View Outlets
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
