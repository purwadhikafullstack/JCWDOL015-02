"use client"
import { getOrderByIdFetchDb } from "@/lib/orderLib"
import { IOrder } from "@/type/orderType"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
const DetailOrderPage = () => {
  const orderId = useParams().orderId
  const [order, setOrder] = useState<IOrder | null>(null)

  useEffect(() => {
    getDetailOrder()
  },[])
  const getDetailOrder = async () => {
    try {
      const { result, ok } = await getOrderByIdFetchDb(Number(orderId))
      if (!ok) throw result.message
      setOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <p className="text-black">{order?.id}</p>
        <p>Order Status: {order?.status}</p>
        <p>Order Date: {order?.createdAt}</p>
        <p>From Outlet: {order?.outletId}</p>
        <p>To Address: {order?.addressId}</p>
        <p>Pickup Schedule: {order?.pickupSchedule}</p>
        <p>Total Price: {order?.totalPrice}</p>
        <p>Total Weight: {order?.totalWeight}</p>
        <p>Total Items: {order?.totalItems}</p>
      </div>
    </div>
  )
}

export default DetailOrderPage