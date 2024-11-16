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