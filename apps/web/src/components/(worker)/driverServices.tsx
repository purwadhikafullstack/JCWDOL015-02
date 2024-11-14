import axios from 'axios';
import { DriverServicesProps, PickupDeliveryRequest } from '@/type/worker/workerType';
import React, { useEffect, useState } from 'react';

export default function DriverServices({ workerDetail }: DriverServicesProps) {
    const [pickupRequests, setPickupRequests] = useState<PickupDeliveryRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<PickupDeliveryRequest | null>(null);
    const [busy, setBusy] = useState(false);
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'

    useEffect(() => {
        if (workerDetail) {
            fetch(`${backendUrl}/api/pdr/driver/${workerDetail.id}`)
                .then((response) => response.json())
                .then((data) => setPickupRequests(data))
                .catch((error) => console.error('Error fetching pickup requests:', error));
        }
    }, [workerDetail]);

    useEffect(() => {
        const hasOngoingRequest = pickupRequests.some(request => request.status === "onGoing");
        setBusy(hasOngoingRequest);
    }, [pickupRequests]);

    const handleCardClick = (request: PickupDeliveryRequest) => {
        setSelectedRequest(request);
    };

    const handleDone = async () => {
        if (!selectedRequest) {
          return;
        }
      
        try {
          const response = await axios.patch(
            `http://localhost:8000/api/pdr/`,
            {
              id: selectedRequest.id,
              status: 'done', 
            }
          );
      
          console.log('Request marked as done successfully', response.data);
      
          setPickupRequests((prevRequests) =>
            prevRequests.map((request) =>
              request.id === selectedRequest.id
                ? { ...request, status: 'done' } 
                : request
            )
          );
          setBusy(false); 
          handleCloseModal(); 
      
        } catch (error) {
          console.error('Error handling the pickup delivery request:', error);
          handleCloseModal(); 
        }
      };
      


    const handlePDR = async () => {
      if (!selectedRequest) {
        return; 
      }

      if (busy) {
        return;
      }
    
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/pdr/`,
          {
            id: selectedRequest.id,
            status: 'onGoing', 
          }
        );
    
        setPickupRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === selectedRequest.id
              ? { ...request, status: 'onGoing' }
              : request
          )
        );
        setBusy(true);
        handleCloseModal()
    
      } catch (error) {
        console.error('Error handling the pickup delivery request:', error);
        handleCloseModal()
      }
    };
    

    const handleCloseModal = () => {
        setSelectedRequest(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-2">Halo, {workerDetail?.name}</h1>

            <h2 className="text-xl font-semibold mt-6 mb-4">Pickup Delivery Requests</h2>
            {busy ? (
                <p className="text-yellow-500 mb-4">You are currently busy with an ongoing request.</p>
            ) : (
                <p className="text-green-500 mb-4">You have no ongoing requests.</p>
            )}

                {pickupRequests.length > 0 ? (
                pickupRequests.map((request) => (
                    request.status !== "done" && (
                    <div
                        key={request.id}
                        onClick={() => handleCardClick(request)}
                        className={`border border-gray-300 rounded-lg p-4 mb-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow ${
                        request.status === "onGoing" ? "bg-yellow-500 text-black" : ""
                        }`}
                    >
                        <p className="font-medium">Status: {request.status}</p>
                        <p>From: {request.fromAddress.address}, {request.fromAddress.city}</p>
                        <p>To: {request.toAddress.address}, {request.toAddress.city}</p>
                        <p>Order ID: {request.orderId}</p>
                        <p>Distance: {request.distance} km</p>
                        <p>Pickup Schedule: {new Date(request.order.pickupSchedule).toLocaleString()}</p>
                    </div>
                    )
                ))
                ) : (
                <p className="text-gray-500">No pickup requests available.</p>
                )}

            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Request Details</h3>
                        <p className="mb-2">Status: {selectedRequest.status}</p>
                        <p className="mb-2">From: {selectedRequest.fromAddress.address}, {selectedRequest.fromAddress.city}</p>
                        <p className="mb-2">To: {selectedRequest.toAddress.address}, {selectedRequest.toAddress.city}</p>
                        <p className="mb-2">Order ID: {selectedRequest.orderId}</p>
                        <p className="mb-2">Distance: {selectedRequest.distance} km</p>
                        <p className="mb-2">Pickup Schedule: {new Date(selectedRequest.order.pickupSchedule).toLocaleString()}</p>
                        <div className='flex justify-center gap-2'>
                            <button
                                onClick={handleCloseModal}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                            {selectedRequest.status === "Wait to pick up" && !busy && 
                                <button 
                                onClick={handlePDR}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    handle Request
                                </button>
                            } 
                           {selectedRequest.status === "onGoing" && (
                            <button
                                onClick={handleDone}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Mark Done
                            </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
