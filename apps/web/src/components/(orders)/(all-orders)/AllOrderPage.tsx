'use client';
import { getOrdersByUserFetchDb, searchOrderFetchDb } from '@/lib/orderLib';
import { useAppSelector } from '@/redux/hooks';
import { IOrder } from '@/type/orderType';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchOrder from '../(search-order)/SearchOrder';

const AllOrderPage = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const selectSearchModal = document.getElementById(
    'modal_search_order',
  ) as HTMLDialogElement;
  const byIdModal = document.getElementById('order_by_id') as HTMLDialogElement;
  const byDateModal = document.getElementById(
    'order_by_date',
  ) as HTMLDialogElement;

  useEffect(() => {
    getOrders();
  }, []);
  const getOrders = async () => {
    try {
      const { result, ok } = await getOrdersByUserFetchDb(user.id);
      if (!ok) throw result.message;
      setOrders([...result.data]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearchOrder = async (
    values: { orderId?: string; date?: string },
    resetForm: () => void,
  ) => {
    setIsLoading(true);
    try {
      const { ok, result } = await searchOrderFetchDb(
        values.orderId
          ? { orderId: Number(values.orderId) }
          : { date: values.date },
      );
      if (!ok) throw new Error(result.message);
      setOrders([...result.data]);
      resetForm();
      selectSearchModal.close();
      byIdModal.close();
      byDateModal.close();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[100vh] py-6 flex flex-col justify-center items-center">
      <div className="text-center my-3 md:my-11 px-5 md:px-0">
        <h1 className="text-2xl md:text-5xl font-semibold uppercase tracking-wide text-black mb-0 mt-12 md:mb-3 md:mt-0">
          Your Order History
        </h1>
        <p>
          Lihat perjalanan pesanan Anda dari awal hingga selesai. Tetap
          terhubung dengan setiap langkah dan temukan kemudahan dalam melacak
          riwayat transaksi Anda.
        </p>
      </div>
      <SearchOrder
        handleSubmitSearch={handleSearchOrder}
        isLoading={isLoading}
        selectSearchModal={selectSearchModal}
        byIdModal={byIdModal}
        byDateModal={byDateModal}
      />
      {orders?.map((order) => (
        <div
          key={order.id}
          className={` ${order?.status == 'waiting_for_payment' ? 'border-green-700' : 'border-beigeCustom'} border-2 w-[95%] md:w-[80%] my-2 text-center rounded-box  cursor-pointer duration-300`}
        >
          <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box ">
            <input type="checkbox" />
            <div className="collapse-title text-base md:text-lg font-bold tracking-wide uppercase">
              (ID){order?.id} - {order?.status.replace(/_/g, ' ')}
            </div>
            <div className="collapse-content">
              <p>From Outlet: {order?.outletId}</p>
              <p>To Address: {order?.addressId}</p>
              <p>
                Total Price:{' '}
                {order?.totalPrice == null
                  ? 'Pending...'
                  : `Rp ${order?.totalPrice}`}
              </p>
              <p>
                Order Date:{' '}
                {new Date(
                  new Date(order?.createdAt as string).getTime() +
                    7 * 60 * 60 * 1000,
                ).toLocaleString('id-ID', {
                  timeZone: 'Asia/Jakarta',
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => router.push(`/user/orders/${order.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllOrderPage;

{
  /* <p className="text-black">{order?.id}</p>
<p>Order Status: {order?.status}</p>
<p>Order Date: {order?.createdAt}</p>
<p>From Outlet: {order?.outletId}</p>
<p>To Address: {order?.addressId}</p>
<p>Pickup Schedule: {order?.pickupSchedule}</p>
<p>Total Price: {order?.totalPrice}</p>
<p>Total Weight: {order?.totalWeight}</p>
<p>Total Items: {order?.totalItems}</p> */
}
