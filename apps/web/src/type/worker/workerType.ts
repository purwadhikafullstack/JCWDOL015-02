
export interface WorkerDetail {
    id: number;
    name: string;
    role: string;
    email: string;
}

export interface DriverServicesProps {
    workerDetail: WorkerDetail | null;
}

export interface PickupDeliveryRequest {
    id: number;
    orderId: number;
    distance: number;
    requestType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    order: {
        id: number;
        status: string;
        pickupSchedule: string;
        paymentStatus: string;
    };
    fromAddress: {
        address: string;
        city: string;
    };
    toAddress: {
        address: string;
        city: string;
    };
}