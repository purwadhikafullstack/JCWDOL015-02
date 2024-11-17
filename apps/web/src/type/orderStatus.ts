// Define the possible order statuses in an enum
export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  SHIPPED = 'shipped',
  NEW = 'NEW', // Example additional status
}

// Optionally, if you need to use the status types in other places (like type checking or function parameters), you can create a type for the status:
export type OrderStatusType = keyof typeof OrderStatus;
