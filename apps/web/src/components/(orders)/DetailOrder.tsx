'use client';
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { getOrderByIdFetchDb } from "../../lib/orderLib";
import { ICustomerDetail, IOrderDetail } from "@/type/orderType";
import TrackingOrderSide from "./TrackingOrderSide";
import { TbMapSearch } from "react-icons/tb";
import BtnPayment from "./BtnPayment";
import BtnConfirmOrder from "./BtnConfirmOrder";
const DetailOrder = () => {
    const orderId = useParams().id
    const [customerDetail, setCustomerDetail] = useState<ICustomerDetail>({} as ICustomerDetail);
    const [outletDetail, setOutletDetail] = useState({ name: '' });
    const [orderDetail, setOrderDetail] = useState<IOrderDetail>({} as IOrderDetail);
    const orderStatuses = ["waiting_for_pickup","on_the_way_to_outlet","arrived_at_outlet","weighed","washed","ironed","packed","waiting_for_payment","ready_for_delivery","on_the_way_to_customer","delivered_to_customer","recalculate"];
    const [price, setPrice] = useState(0);
    const [cos, setCos] = useState(0);
    useEffect(() => {
        const getOrderDetail = async () => {
            try {
                const { result, ok } = await getOrderByIdFetchDb(Number(orderId));
                if (!ok) throw result.message;
                const combineCustomerAddress = {
                    address: `${result.data.customerAddress.address},${result.data.customerAddress.city}, ${result.data.customerAddress.state}, ${result.data.customerAddress.country}, ${result.data.customerAddress.postalCode} - (${result.data.customerAddress.phone})`
                };
                setCustomerDetail({...result.data.customerIntro, ...combineCustomerAddress});
                setOutletDetail(result.data.outletName);
                setOrderDetail(result.data.order);
                setPrice(result.data.order.totalWeight * 30000);
            } catch (error) {
                console.log(error)
            }
        }
        getOrderDetail();
    },[orderId])

    useEffect(() => {
        setCos((orderDetail.totalPrice || 0) - price);
    },[price, orderDetail.totalPrice])

    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace("Rp", "Rp.");
    };

  return (
    <div>
         <div className="drawer lg:drawer-open">
            <input id="tracking_order_sidebar" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-start py-5 px-5">
                {/* Page content here */}
                <h1 className="text-3xl md:text-4xl font-semibold uppercase tracking-wide text-black mb-10 mt-12 md:mt-0 text-center w-full">Detail Order</h1>
                <label htmlFor="tracking_order_sidebar" className="mb-2 cursor-pointer bg-black text-beigeCustom py-2 px-4 rounded-full transition duration-200 shadow-sm shadow-[#00000048] text-xs uppercase tracking-wide my-1 flex items-center gap-2 lg:hidden">
                    Tracking Order <TbMapSearch/>
                </label>

                <div className="w-full flex flex-col justify-center items-center bg-beigeCustom shadow-xl rounded-lg p-2 md:p-8">
                    <div className="w-full flex flex-col md:flex-row justify-center items-start gap-2">
                        <div className="w-full md:w-1/2 flex justify-center items-start">
                            <div className=" w-full ">
                                <p className="text-lg md:text-xl text-center mt-3 md:text-start md:mt-0 font-light uppercase tracking-wider text-gray-600">Order Id - #{orderDetail?.id}</p>
                                <h2 className="text-lg md:text-2xl text-center md:text-start font-medium tracking-wide mt-0 md:mt-3">{customerDetail?.username}</h2>
                                <p className="text-center md:text-start text-xs md:text-sm md:pr-5">{customerDetail?.address}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-start  mt-3 md:mt-0">
                            <div className="w-1/2 text-center md:text-right">
                                <p className="text-lg md:text-xl font-light uppercase tracking-wider text-gray-600">Ordered ON</p>
                                <h2 className="text-lg md:text-2xl lg:text-3xl font-light tracking-wide mt-0 md:mt-3">
                                    {new Date(new Date(orderDetail?.createdAt as string).getTime() +7 * 60 * 60 * 1000).toLocaleString('en-US', {timeZone: 'Asia/Jakarta',dateStyle: 'full'})}
                                </h2>
                            </div>
                            <div className="w-1/2 text-center md:text-right">
                                <p className="text-lg md:text-xl font-light uppercase tracking-wider text-gray-600">status</p>
                                <h2 className="text-xl md:pl-3 md:text-2xl font-semibold tracking-wide mt-0 md:mt-3 text-black uppercase">{orderDetail.status && orderDetail.status.replace(/_/g, ' ')}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-0.5 bg-black my-5"></div>

                    <div className="w-full flex flex-col md:flex-row justify-center items-start gap-2">
                        <div className="w-full md:w-1/2 flex justify-center items-start ">
                            <div className="w-1/2 text-center md:text-left">
                                <p className="text-lg md:text-xl font-light uppercase tracking-wider text-gray-600">Total items</p>
                                <h2 className="text-lg md:text-xl lg:text-2xl font-light tracking-wide mt-0 md:mt-3">
                                    {orderDetail?.totalItems} PCS
                                </h2>
                            </div>
                            <div className="w-1/2 text-center md:text-left pl-5">
                                <p className="text-lg md:text-xl font-light uppercase tracking-wider text-gray-600">weight</p>
                                <h2 className="text-lg md:text-xl lg:text-2xl font-light tracking-wide mt-0 md:mt-3 whitespace-normal break-words">
                                    {orderDetail?.totalWeight !== null ? (orderDetail?.totalWeight * 1000)+ " gr":"0 gr"}
                                </h2>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-start mt-3 md:mt-0">
                            <div className="w-1/3 text-center md:text-right">
                                <p className="text-lg md:text-xl font-light uppercase tracking-wider text-gray-600">Price</p>
                                <h2 className="px-2 md:px-0 md:pl-4 text-base md:text-xl lg:text-2xl font-light tracking-wide mt-0 md:mt-3 whitespace-normal break-words">
                                    {price !== 0 ? formatIDR(price) : `N/A`}
                                </h2>
                            </div>
                            <div className="w-1/3 text-center md:text-right">
                                <p className="text-lg md:text-xl font-light uppercase tracking-wider text-gray-600">COS</p>
                                <h2 className="px-2 md:px-0 md:pl-4 text-base md:text-xl lg:text-2xl font-light tracking-wide mt-0 md:mt-3 whitespace-normal break-words">
                                    {cos !== 0 ? formatIDR(cos) : `N/A`}
                                </h2>
                            </div>
                            <div className="w-1/3 text-center md:text-right mb-5">
                                <p className="text-lg md:text-xl font-semibold uppercase tracking-wider text-black">Total</p>
                                <h2 className="px-2 md:px-0 md:pl-4 text-base md:text-xl lg:text-2xl font-medium tracking-wide mt-0 md:mt-3 whitespace-normal break-words">
                                    {orderDetail?.totalPrice !== null ? formatIDR(orderDetail?.totalPrice) : `N/A`}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {!['delivered_to_customer', 'on_the_way_to_customer'].includes(orderDetail?.status as string)  && (<>
                        <h1 className="mt-8 text-lg md:text-xl font-semibold uppercase tracking-wider text-black">Payment Status :</h1>
                        {orderDetail?.paymentStatus == 'pending' && (
                            <h1 className="w-[80%] md:w-[50%] my-1 text-center text-xs sm:text-sm md:text-lg lg:text-xl font-semibold uppercase tracking-wide text-black mb-4">Your order details are being reviewed, and the price will be confirmed soon.</h1>
                        )}
                        {orderDetail?.paymentStatus == 'unpaid' && (
                            <BtnPayment orderId={orderDetail?.id as number} email={customerDetail?.email as string} customerName={customerDetail?.username as string} totalPrice={orderDetail?.totalPrice as number}/>
                        )}
                        {orderDetail?.paymentStatus == 'paid' && (
                            <h2 className="w-[80%] md:w-[50%] my-1 text-center text-xs sm:text-sm md:text-lg lg:text-xl font-semibold tracking-wide text-black mb-4">Thank you! Your payment has been successfully received, and we are processing your order.</h2>
                        )}
                    </>)}
                    {orderDetail?.status == 'on_the_way_to_customer' && (
                        <BtnConfirmOrder orderId={orderDetail?.id as number}/>
                    )}
                </div>
                <h2 className="w-full text-center text-xs sm:text-sm md:text-lg lg:text-xl font-semibold uppercase tracking-wide text-grayCustom mb-0 mt-12 italic">Your order is handled by our nearest outlet  :</h2>
                <h3 className="w-full text-center text-xs sm:text-sm md:text-lg lg:text-xl font-semibold uppercase tracking-wide text-grayCustom mb-0 md:mb-3 italic">{outletDetail?.name}</h3>
            </div>
            <TrackingOrderSide orderDetail={orderDetail} orderStatuses={orderStatuses} />
        </div>
    </div>
  )
}

export default DetailOrder