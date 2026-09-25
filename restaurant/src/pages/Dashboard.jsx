import { useEffect, useState } from "react";

import {
    getRestaurantOrders,
    updateOrderStatus
} from "../api/orderApi.js";

const Dashboard = () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchOrders = async () => {

        try {

            const data =
                await getRestaurantOrders();

            console.log(
                "Restaurant orders:",
                data
            );

            setOrders(
                data.orders || []
            );

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

    useEffect(() => {

        fetchOrders();

    }, []);

    const handleStatusChange = async (
        orderId,
        status
    ) => {

        try {

            await updateOrderStatus(
                orderId,
                status
            );

            // Get latest orders
            fetchOrders();

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order"
            );
        }
    };

    if (loading) {

        return (
            <h2>
                Loading orders...
            </h2>
        );
    }

    return (
        <div className="restaurant-dashboard">

            <div className="dashboard-header">

                <div>

                    <h1>
                        Restaurant Dashboard 🍽️
                    </h1>

                    <p>
                        Welcome, {user?.name}
                    </p>

                </div>

            </div>

            {error && (
                <p>
                    {error}
                </p>
            )}

            <h2>
                Orders
            </h2>

            {orders.length === 0 ? (

                <p>
                    No orders yet.
                </p>

            ) : (

                <div>

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <h3>
                                Order #
                                {order._id.slice(-6)}
                            </h3>

                            <p>
                                Customer:{" "}
                                {order.customer?.name}
                            </p>

                            <p>
                                Phone:{" "}
                                {order.customer?.phone}
                            </p>

                            <p>
                                Delivery Address:{" "}
                                {order.deliveryAddress}
                            </p>

                            <h4>
                                Items
                            </h4>

                            {order.items.map(
                                (item, index) => (

                                    <p key={index}>

                                        {item.name}
                                        {" × "}
                                        {item.quantity}

                                        {" — ₹"}
                                        {item.price *
                                            item.quantity}

                                    </p>

                                )
                            )}

                            <hr />

                            <p>
                                Subtotal: ₹
                                {order.subtotal}
                            </p>

                            <p>
                                Delivery Fee: ₹
                                {order.deliveryFee}
                            </p>

                            <h3>
                                Total: ₹
                                {order.totalAmount}
                            </h3>

                            <p>
                                Payment:{" "}
                                {order.paymentMethod}
                            </p>

                            <p>
                                Status:{" "}
                                <strong>
                                    {order.orderStatus}
                                </strong>
                            </p>

                            <div>

                                {order.orderStatus ===
                                    "PLACED" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleStatusChange(
                                                        order._id,
                                                        "ACCEPTED"
                                                    )
                                                }
                                            >
                                                Accept
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleStatusChange(
                                                        order._id,
                                                        "REJECTED"
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                {order.orderStatus ===
                                    "ACCEPTED" && (
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    order._id,
                                                    "PREPARING"
                                                )
                                            }
                                        >
                                            Start Preparing
                                        </button>
                                    )}

                                {order.orderStatus ===
                                    "PREPARING" && (
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    order._id,
                                                    "READY"
                                                )
                                            }
                                        >
                                            Mark Ready
                                        </button>
                                    )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default Dashboard;