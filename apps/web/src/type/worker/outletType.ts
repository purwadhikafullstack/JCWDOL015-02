

export type OutletData = {
    token: string;
    outletId:number;
    outletName: string;
    outletEmail: string;
};

export type OrderData = {
    id: number;
    userId: number;
    addressId: number;
    outletId: number;
    package: string | null;
    status: string;
    pickupSchedule: string;
    totalWeight: number | null;
    totalItems: number;
    totalPrice: number | null;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
};

export type OrderItemData = {
    shirt: number;
    longShirt: number;
    pants: number;
    longPant: number;
    veil: number;
    underwear: number;
    bedsheet: number;
    pillowCase: number;
    blanket: number;
    towel: number;
    curtain: number;
};