'use client'

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { OrderItemData } from "@/type/worker/outletType";

export default function ProcessOrderPage() {
    const router = useRouter();
    const { orderId } = useParams(); // Ambil parameter dari URL

    const [orderItems, setOrderItems] = useState<OrderItemData>({
        shirt: 0,
        longShirt: 0,
        pants: 0,
        longPant: 0,
        veil: 0,
        underwear: 0,
        bedsheet: 0,
        pillowCase: 0,
        blanket: 0,
        towel: 0,
        curtain: 0,
    });

    const [totalItems, setTotalItems] = useState(0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrderItems({
            ...orderItems,
            [name]: parseInt(value) || 0,
        });
    };

    useEffect(() => {
        const total = Object.values(orderItems).reduce((acc, item) => acc + item, 0);
        setTotalItems(total);
    }, [orderItems]);

    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:8000/api/order/${orderId}/items`, {
                ...orderItems,
                totalItems,
            });
            alert("Order items updated successfully!");
            router.push("/orders");
        } catch (error) {
            console.error("Error updating order items:", error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Process Order {orderId}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {Object.keys(orderItems).map((item) => (
                    <div key={item} className="mb-4 flex items-center gap-2">
                        <label className="w-1/2 text-gray-700 font-bold" htmlFor={item}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </label>
                        <input
                            type="number"
                            id={item}
                            name={item}
                            value={orderItems[item as keyof OrderItemData]}
                            onChange={handleInputChange}
                            className="w-1/2 px-3 py-2 border rounded"
                            min="0"
                        />
                    </div>
                ))}
                <div className="mt-4 text-lg font-semibold">
                    Total Items: {totalItems}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded mt-4">
                    Save Order Items
                </button>
            </form>
        </div>
    );
}
