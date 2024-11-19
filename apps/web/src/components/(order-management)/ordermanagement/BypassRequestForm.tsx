import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setError } from '@/redux/slices/orderSlice';
import { getToken } from '@/lib/server';

const BypassRequestForm: React.FC<{ orderId: number; workerId: number }> = ({
  orderId,
  workerId,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [status, setStatus] = useState<
    'PENDING' | 'APPROVED' | 'REJECTED' | null
  >(null);
  const [token, setToken] = useState<string | null>(null); // Add token state
  const dispatch = useDispatch<AppDispatch>();

  // Fetch the token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      if (fetchedToken) {
        setToken(fetchedToken); // Set the token in state
      }
    };

    fetchToken();
  }, []);

  const handleRequest = async () => {
    if (!token) {
      dispatch(setError('Token is not available'));
      return; // Prevent request if token is not available
    }

    setIsRequesting(true);

    try {
      const response = await fetch(`/api/bypass-request/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, workerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bypass request');
      }

      const data = await response.json();
      setStatus('PENDING');
    } catch (error) {
      dispatch(setError('Failed to submit bypass request'));
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Request Bypass Approval
      </h2>
      <div className="flex justify-between text-gray-600 mb-6">
        <p className="text-sm">
          Order ID:{' '}
          <span className="font-semibold text-gray-800">{orderId}</span>
        </p>
        <p className="text-sm">
          Worker ID:{' '}
          <span className="font-semibold text-gray-800">{workerId}</span>
        </p>
      </div>

      {/* Flex container to align button to the right */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleRequest}
          className={`px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform ${
            isRequesting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:scale-95 focus:ring-2 focus:ring-blue-400'
          }`}
          disabled={isRequesting}
        >
          {isRequesting ? 'Requesting...' : 'Request Bypass'}
        </button>
      </div>

      {status && (
        <p
          className={`mt-6 py-2 px-4 rounded-lg text-center font-semibold transition-colors duration-300 ${
            status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'APPROVED'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          Status: {status}
        </p>
      )}
    </div>
  );
};

export default BypassRequestForm;
