"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { OrderData, OutletData } from "@/type/worker/outletType";
import { useRouter } from 'next/navigation';


export default function IronerDashboard() {
    const [outletWorker, setoutletWorker] = useState<any | null>(null);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const router = useRouter();

    useEffect(() => {
        const data = localStorage.getItem('outletWorker');
        if (data) {
            const outletData: OutletData = JSON.parse(data);
            setoutletWorker(outletData);
        }
    }, []);

    useEffect(() => {
        if (outletWorker) {
            axios.get("http://localhost:8000/api/order")
                .then((response) => {
                    const filteredOrders = response.data.filter((order: OrderData) => order.outletId === outletWorker.outletId && order.status == "ironed");
                    setOrders(filteredOrders);
                })
                .catch((error) => {
                    console.error("Error fetching orders:", error);
                });
        }
    }, [outletWorker]);

    const handleProcessOrder = (orderId: number, userId: number, outletWorkerId:number) => {
        router.push(`/orders/${orderId}/iron?userId=${userId}&outletWorkerId=${outletWorkerId}`);
    };
    
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ironer Dashboard</h2>
                
                {outletWorker ? (
                    <div>
                        <p><strong>Name:</strong> {outletWorker.name}</p>
                        <p><strong>Email:</strong> {outletWorker.email}</p>

                        <h3 className="mt-6 mb-2 text-lg font-semibold">Orders</h3>
                        {orders.length > 0 ? (
                            <ul>
                                {orders.map((order) => (
                                    <li key={order.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                        <p><strong>Order ID:</strong> {order.id}</p>
                                        <p><strong>Status:</strong> {order.status}</p>
                                        <p><strong>Pickup Schedule:</strong> {new Date(order.pickupSchedule).toLocaleString()}</p>
                                        <p><strong>Total Items:</strong> {order.totalItems}</p>
                                        <p><strong>Total Price:</strong> {order.totalPrice}</p>
                                        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                                        <p><strong>Distance:</strong> {order.pickupDeliveryRequests[0]?.distance || 0}</p>
                                        {order.status === "ironed" && (
                                            <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded">
                                                <p>⚠️ This order needs to be ironed</p>
                                                <button
                                                    onClick={() => handleProcessOrder(order.id, order.userId, outletWorker.id)}
                                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Process Order
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No orders to be proccess on iron station</p>
                        )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}