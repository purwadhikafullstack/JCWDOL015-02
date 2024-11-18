export interface IOrder {
    id: number
    addressId: number
    outletId: number
    pickupSchedule: String
    status: String
    paymentStatus: String
    paymentLink: String
    totalItems: number
    totalPrice: number | null
    totalWeight: number | null
    createdAt: String
}

export interface IOrderDetail {
    id: number
    createdAt: String
    pickupSchedule: String
    status: String
    paymentStatus: String
    totalItems: number
    totalPrice: number | null
    totalWeight: number | null
}

export interface ICustomerDetail {
    username: String;
    email: String;
    address: String;
}