import { formatDate, formatTime } from '@/lib/dateTime';
import { useEffect, useState } from 'react';

interface Attendance {
    id:number;
    workerId: number;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
}

export default function Attendance() {
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [error, setError] = useState<string>('');
    const [showCheckInButton, setShowCheckInButton] = useState<boolean>(false);

    useEffect(() => {
        const outletWorker = JSON.parse(localStorage.getItem('outletWorker') || '{}');
        const workerId = outletWorker.id;

        const today = new Date().toISOString().split('T')[0];

        const fetchAttendance = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/attendence/date?workerId=${workerId}&date=${today}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.error === "Attendance record not found for the specified worker and date") {
                        setShowCheckInButton(true); // Tampilkan tombol Check In jika attendance tidak ditemukan
                    } else {
                        setError(errorData.error || 'Failed to fetch attendance');
                    }
                } else {
                    const data: Attendance = await response.json();
                    setAttendance(data);
                    setShowCheckInButton(false); // Sembunyikan tombol Check In jika attendance ditemukan
                }
            } catch (err) {
                setError((err as Error).message);
            }
        };

        if (workerId) {
            fetchAttendance();
        } else {
            setError('Worker ID not found in localStorage');
        }
    }, []);

    const handleCheckIn = async () => {
        const outletWorker = JSON.parse(localStorage.getItem('outletWorker') || '{}');
        const workerId = outletWorker.id;
        const today = new Date().toISOString().split('T')[0];

        try {
            const response = await fetch('http://localhost:8000/api/attendence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workerId,
                    date: today,
                    checkIn: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                const data: Attendance = await response.json();
                setAttendance(data);
                setShowCheckInButton(false); 
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to check in');
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleCheckOut = async () => {
        const attendenceId = attendance?.id

        try {
            const response = await fetch(`http://localhost:8000/api/attendence/id/${attendenceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    checkOut: new Date().toISOString()
                }),
            });

            if (response.ok) {
                const data: Attendance = await response.json();
                setAttendance(data);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to check out');
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };


    return (
        <div>
            <h1>Attendance for Today</h1>
            {error && <p className="text-red-500">{error}</p>}
            {attendance ? (
                <div>
                    <p>Date: {formatDate(attendance.date)}</p>
                    <p>Check In: {formatTime(attendance.checkIn)}</p>
                    <p>Check Out: {formatTime(attendance.checkOut)}</p>


                    {attendance.checkIn && attendance.checkOut ? (
                        <p className="mt-4 text-green-600">Sampai jumpa lagi, selamat beristirahat!</p>
                    ) : (
                        <button
                            // Implementasikan handleCheckout untuk memperbarui data attendance dengan checkOut
                            className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-blue-600"
                            onClick={handleCheckOut}
                        >
                            Check Out
                        </button>
                    )}
                </div>
            ) : (
                !error && <p>Loading attendance data...</p>
            )}

            {showCheckInButton && (
                <button
                    onClick={handleCheckIn}
                    className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Check In
                </button>
            )}
        </div>
    );
}
