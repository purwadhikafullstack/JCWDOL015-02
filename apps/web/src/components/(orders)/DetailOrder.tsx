'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { getOrderByIdFetchDb } from '../../lib/orderLib';

const DetailOrder = () => {
  const { id } = useParams(); // Mengambil ID dari parameter URL
  const orderId = id;
  useEffect(() => {
    const getOrderDetail = async () => {
      try {
        const { result, ok } = await getOrderByIdFetchDb(Number(id));
        if (!ok) throw result.message;
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderDetail();
  }, [id, orderId]);
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center py-5">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Tracking Order
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <h1 className="text-center w-full text-lg md:text-xl font-bold overflow-y-scroll pt-28 lg:pt-0 ">
              Tracking Order
            </h1>
            <ul className="steps steps-vertical ">
              <li className={`step step-neutral`}>Waiting For Pickup</li>
              <li className={`step step-neutral`}>On The Way To Outlet</li>
              <li className={`step step-neutral`}>Arrived At Outlet</li>
              <li className={`step step-neutral`}>Weighed</li>
              <li className={`step`}>Washed</li>
              <li className={`step`}>Ironed</li>
              <li className={`step`}>Packed</li>
              <li className={`step`}>Waiting For Payment</li>
              <li className={`step`}>Ready For Delivery</li>
              <li className={`step`}>On The Way To Customer</li>
              <li className={`step`}>Delivered</li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
