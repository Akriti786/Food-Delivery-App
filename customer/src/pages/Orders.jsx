import { useEffect, useState } from "react";

import {
    getMyOrders
} from "../api/orderApi.js";

const Orders = () => {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const data = await getMyOrders();

                console.log(
                    "My orders response:",
                    data
                );

                setOrders(data.orders || []);

            } catch (error) {

                console.error(
                    "Orders error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchOrders();

    }, []);

    if (loading) {
        return <h2>Loading orders...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (orders.length === 0) {

        return (
            <div>
                <h1>
                    My Orders 📦
                </h1>

                <p>
                    You haven't placed any orders yet.
                </p>
            </div>
        );
    }

    return (
        <div className="orders-page">

            <h1>
                My Orders 📦
            </h1>

            {orders.map((order) => (

                <div
                    className="order-card"
                    key={order._id}
                >

                    <h2>
                        Order #{order._id.slice(-6)}
                    </h2>

                    <p>
                        Restaurant:{" "}
                        {order.restaurant?.name}
                    </p>

                    <p>
                        Status:{" "}
                        <strong>
                            {order.orderStatus}
                        </strong>
                    </p>

                    <p>
                        Payment:{" "}
                        {order.paymentMethod}
                    </p>

                    <p>
                        Payment Status:{" "}
                        {order.paymentStatus}
                    </p>

                    <p>
                        Delivery Address:{" "}
                        {order.deliveryAddress}
                    </p>

                    <h3>
                        Items
                    </h3>

                    {order.items.map((item, index) => (

                        <div
                            key={index}
                        >

                            <p>
                                {item.name}
                                {" × "}
                                {item.quantity}
                            </p>

                            <p>
                                ₹{item.price}
                            </p>

                        </div>

                    ))}

                    <hr />

                    <p>
                        Subtotal: ₹
                        {order.subtotal}
                    </p>

                    <p>
                        Delivery Fee: ₹
                        {order.deliveryFee}
                    </p>

                    <p>
                        Discount: ₹
                        {order.discount}
                    </p>

                    <h2>
                        Total: ₹
                        {order.totalAmount}
                    </h2>

                </div>

            ))}

        </div>
    );
};

export default Orders;