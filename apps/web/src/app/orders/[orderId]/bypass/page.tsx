'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function IronStation() {
  const router = useRouter();
  const { orderId } = useParams()
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';


  const [workHistories, setWorkHistory] = useState<any[]>([]);
  const [lastWorkerHistory, setLastWorkerHistory] = useState<any>()


  const approved = async () => {
    try {
      // Tentukan status berdasarkan kondisi
      let updatedStatus = '';
  
      if (!lastWorkerHistory) {
        // Jika tidak ada work history, set status menjadi 'weighed'
        updatedStatus = 'weighed';
      } else if (lastWorkerHistory.station === 'washer') {
        updatedStatus = 'washed';
      } else if (lastWorkerHistory.station === 'ironer') {
        updatedStatus = 'ironed';
      } else {
        console.error('Unknown station type');
        return;
      }
  
      // Kirim permintaan PATCH untuk memperbarui status order
      await axios.patch(`${backendUrl}/api/order/${orderId}`, {
        status: updatedStatus,
        userId: lastWorkerHistory?.order?.userId || null, // Jika tidak ada userId, kirim null
      });
  
      // Arahkan ke halaman dashboard setelah sukses
      router.push('/outlets/dashboard');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  
  const decline = () => {
    router.push('/outlets/dashboard') 
  }

  useEffect(() => {
    const fetchOrderReference = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/work-history/${orderId}/order`
        );
  
        const workHistoryData = response.data;
        setWorkHistory(workHistoryData);
  
        // Ambil elemen terakhir dari array workHistoryData
        if (workHistoryData.length > 0) {
          const latestWorkHistory = workHistoryData[workHistoryData.length - 1];
          setLastWorkerHistory(latestWorkHistory);
        }
      } catch (error) {
        console.error('Error fetching work history:', error);
      }
    };
  
    fetchOrderReference();
  }, [orderId]);
  

  return (
 <div>
   <button className="bg-blue-500" onClick={approved}>Approve</button>
   <button className="bg-red-500" onClick={decline}>Decline</button>
 </div>
  );
}
