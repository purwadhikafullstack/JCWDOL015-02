import * as Yup from 'yup';

// Skema validasi untuk pencarian berdasarkan Order ID
export const searchOrderByIdSchema = Yup.object({
  orderId: Yup.string()
    .matches(/^\d+$/, 'Order ID must be a numeric value') // Memastikan hanya angka
    .min(6, 'Order ID must be at least 6 digits')
    .required('Order ID is required'),
});

// Skema validasi untuk pencarian berdasarkan tanggal pesanan
export const orderDateSchema = Yup.object({
  orderDate: Yup.date()
    .required('Order date is required')
    .max(new Date(), 'Order date cannot be in the future')
    .typeError('Please enter a valid date (e.g., YYYY-MM-DD)'),
});
