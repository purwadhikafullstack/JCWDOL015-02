"use client"; 
import AttendanceToday from '@/components/(worker)/attendenceToday';
import DriverServices from '@/components/(worker)/driverServices';
import IronerDashboard from '@/components/(worker)/ironerDashboard';
import PackerDashboard from '@/components/(worker)/packerDashboard';
import WasherDashboard from '@/components/(worker)/washerDashboard';
import React, { useEffect, useState } from 'react';

interface WorkerDetail {
    id:number;
    name: string;
    role: string;
    email:string;
}
export default function Attendance() {
    const [role, setRole] = useState<string | null>(null);
    const [workerDetail, setWorkerDetail] = useState<WorkerDetail | null>(null);

    useEffect(() => {
        const data = localStorage.getItem('outletWorker');
        if (data) {
            const workerData = JSON.parse(data);
            setRole(workerData.role);
            setWorkerDetail(workerData);
        }
    }, []);

    return (
        <div>
            <AttendanceToday />
            {role === 'driver' && workerDetail && 
                <DriverServices workerDetail={workerDetail} />
            }
            {role === 'washer' && workerDetail && 
                <WasherDashboard/>
            }
            {role === 'ironer' && workerDetail && 
                <IronerDashboard/>
            }
            {role === 'packer' && workerDetail && 
                <PackerDashboard/>
            }
        </div>
    );
}


