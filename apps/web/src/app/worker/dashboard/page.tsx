"use client"; 

import AttendanceToday from '@/components/(worker)/attendenceToday';
import React, { useEffect, useState } from 'react';

export default function Attendance() {
    const [workerId, setWorkerId] = useState('');
    const [message, setMessage] = useState('');
    const [checkIn, setCheckin] = useState(false)

    const handleCheckIn = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/attendance/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workerId,
                    date: new Date().toISOString(),
                    checkIn: new Date().toISOString(),
                }),
            });

            const data = await response.json();
          
            if (response.ok) {
                setMessage('Check-in successful');
            } else {
                setMessage(data.error || 'Check-in failed');
            }
        } catch (error) {
            setMessage('An error occurred during check-in');
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/attendance/${workerId}/checkout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    checkOut: new Date().toISOString(),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Check-out successful');
            } else {
                setMessage(data.error || 'Check-out failed');
            }
        } catch (error) {
            setMessage('An error occurred during check-out');
        }
    };

    return (
        <div>
            <AttendanceToday/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Attendance</h2>

                    {message && (
                        <p className="mb-4 text-center text-green-600">{message}</p>
                    )}

                    <div className="mb-4">
                        <label htmlFor="workerId" className="block text-sm font-medium text-gray-700">Worker ID</label>
                        <input
                            type="text"
                            id="workerId"
                            value={workerId}
                            onChange={(e) => setWorkerId(e.target.value)}
                            className="w-full px-4 py-2 mt-1 text-gray-800 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Worker ID"
                            required
                        />
                    </div>

                    <button
                        onClick={handleCheckIn}
                        className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                    >
                        Check In
                    </button>

                    <button
                        onClick={handleCheckOut}
                        className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                    >
                        Check Out
                    </button>
                </div>
            </div>
        </div>
    );
}
