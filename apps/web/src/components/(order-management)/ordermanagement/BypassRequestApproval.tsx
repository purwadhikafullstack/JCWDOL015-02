import { useState } from 'react';
import { getToken } from '@/lib/server';

const BypassRequestApproval: React.FC<{
  requestId: number;
  initialStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}> = ({ requestId, initialStatus }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const token = getToken();
  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bypass-request/approve/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve bypass request');
      }

      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bypass-request/approve/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject bypass request');
      }

      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <p className="mb-4 text-lg font-semibold text-gray-700">
        Bypass Request Status:{' '}
        <span
          className={`${
            status === 'PENDING'
              ? 'text-yellow-500'
              : status === 'APPROVED'
                ? 'text-green-500'
                : 'text-red-500'
          } font-bold`}
        >
          {status}
        </span>
      </p>
      {status === 'PENDING' && (
        <div className="flex justify-end space-x-4 ">
          <button
            onClick={handleApprove}
            className="flex items-center px-6 py-3 font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-md disabled:bg-green-300 transition-all duration-150"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Approve'
            )}
          </button>
          <button
            onClick={handleReject}
            className="flex items-center px-6 py-3 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md disabled:bg-red-300 transition-all duration-150"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Reject'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BypassRequestApproval;
