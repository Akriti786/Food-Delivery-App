import { useEffect, useState } from "react";

import {
    getReadyOrders,
    getMyOrders,
    assignOrder,
    updateDeliveryOrderStatus
} from "../api/deliveryApi.js";

const Dashboard = () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [readyOrders, setReadyOrders] =
        useState([]);

    const [myOrders, setMyOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchReadyOrders = async () => {

        try {

            const data =
                await getReadyOrders();

            setReadyOrders(
                data.orders || []
            );

        } catch (error) {

            console.error(
                "Available orders error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load available orders"
            );
        }
    };

    const fetchMyOrders = async () => {

        try {

            const data =
                await getMyOrders();

            setMyOrders(
                data.orders || []
            );

        } catch (error) {

            console.error(
                "My orders error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load my orders"
            );
        }
    };

    const fetchOrders = async () => {

        setLoading(true);
        setError("");

        await Promise.all([
            fetchReadyOrders(),
            fetchMyOrders()
        ]);

        setLoading(false);
    };

    useEffect(() => {

        fetchOrders();

    }, []);

    const handleAssign = async (
        orderId
    ) => {

        try {

            await assignOrder(orderId);

            alert(
                "Order assigned successfully 🚴"
            );

            fetchOrders();

        } catch (error) {

            console.error(
                "Assign order error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to assign order"
            );
        }
    };

    const handleStatusChange = async (
        orderId,
        status
    ) => {

        try {

            await updateDeliveryOrderStatus(
                orderId,
                status
            );

            alert(
                `Order ${status}`
            );

            fetchOrders();

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );
        }
    };

    if (loading) {

        return (
            <h2>
                Loading delivery dashboard...
            </h2>
        );
    }

    /*
        Separate active and completed orders
    */

    const activeOrders =
        myOrders.filter(
            (order) =>
                [
                    "ASSIGNED",
                    "PICKED_UP",
                    "OUT_FOR_DELIVERY"
                ].includes(order.orderStatus)
        );

    const completedOrders =
        myOrders.filter(
            (order) =>
                order.orderStatus === "DELIVERED"
        );

    return (
        <div className="delivery-dashboard">

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div className="dashboard-header">

                <h1>
                    Delivery Dashboard 🚴
                </h1>

                <p>
                    Welcome, {user?.name}
                </p>

            </div>


            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {error && (
                <p>
                    {error}
                </p>
            )}


            {/* ========================= */}
            {/* AVAILABLE ORDERS */}
            {/* ========================= */}

            <h2>
                📦 Available Orders
            </h2>

            {readyOrders.length === 0 ? (

                <p>
                    No available orders.
                </p>

            ) : (

                readyOrders.map(
                    (order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <h3>
                                Order #
                                {order._id.slice(-6)}
                            </h3>

                            <h4>
                                Restaurant
                            </h4>

                            <p>
                                {
                                    order.restaurant?.name
                                }
                            </p>

                            <p>
                                Restaurant Address:{" "}
                                {
                                    order.restaurant?.address
                                }
                            </p>

                            <h4>
                                Customer
                            </h4>

                            <p>
                                Name:{" "}
                                {
                                    order.customer?.name
                                }
                            </p>

                            <p>
                                Phone:{" "}
                                {
                                    order.customer?.phone
                                }
                            </p>

                            <p>
                                Delivery Address:{" "}
                                {
                                    order.deliveryAddress
                                }
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
                                    </p>

                                )
                            )}

                            <h3>
                                Total: ₹
                                {
                                    order.totalAmount
                                }
                            </h3>

                            <p>
                                Payment:{" "}
                                {
                                    order.paymentMethod
                                }
                            </p>

                            <p>
                                Status:{" "}
                                <strong>
                                    {
                                        order.orderStatus
                                    }
                                </strong>
                            </p>

                            <button
                                onClick={() =>
                                    handleAssign(
                                        order._id
                                    )
                                }
                            >
                                🚴 Assign Order
                            </button>

                        </div>

                    )
                )
            )}


            {/* ========================= */}
            {/* ACTIVE ORDERS */}
            {/* ========================= */}

            <h2>
                🚴 Active Orders
            </h2>

            {activeOrders.length === 0 ? (

                <p>
                    No active orders.
                </p>

            ) : (

                activeOrders.map(
                    (order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <h3>
                                Order #
                                {order._id.slice(-6)}
                            </h3>

                            <h4>
                                Restaurant
                            </h4>

                            <p>
                                {
                                    order.restaurant?.name
                                }
                            </p>

                            <p>
                                Restaurant Address:{" "}
                                {
                                    order.restaurant?.address
                                }
                            </p>

                            <h4>
                                Customer
                            </h4>

                            <p>
                                Name:{" "}
                                {
                                    order.customer?.name
                                }
                            </p>

                            <p>
                                Phone:{" "}
                                {
                                    order.customer?.phone
                                }
                            </p>

                            <p>
                                Delivery Address:{" "}
                                {
                                    order.deliveryAddress
                                }
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
                                    </p>

                                )
                            )}

                            <h3>
                                Total: ₹
                                {
                                    order.totalAmount
                                }
                            </h3>

                            <p>
                                Payment:{" "}
                                {
                                    order.paymentMethod
                                }
                            </p>

                            <p>
                                Status:{" "}
                                <strong>
                                    {
                                        order.orderStatus
                                    }
                                </strong>
                            </p>


                            {/* ASSIGNED */}

                            {order.orderStatus ===
                                "ASSIGNED" && (

                                <button
                                    onClick={() =>
                                        handleStatusChange(
                                            order._id,
                                            "PICKED_UP"
                                        )
                                    }
                                >
                                    📦 Picked Up
                                </button>

                            )}


                            {/* PICKED UP */}

                            {order.orderStatus ===
                                "PICKED_UP" && (

                                <button
                                    onClick={() =>
                                        handleStatusChange(
                                            order._id,
                                            "OUT_FOR_DELIVERY"
                                        )
                                    }
                                >
                                    🚴 Out for Delivery
                                </button>

                            )}


                            {/* OUT FOR DELIVERY */}

                            {order.orderStatus ===
                                "OUT_FOR_DELIVERY" && (

                                <button
                                    onClick={() =>
                                        handleStatusChange(
                                            order._id,
                                            "DELIVERED"
                                        )
                                    }
                                >
                                    ✅ Mark Delivered
                                </button>

                            )}

                        </div>

                    )
                )
            )}


            {/* ========================= */}
            {/* ORDER HISTORY */}
            {/* ========================= */}

            <h2>
                📜 Order History
            </h2>

            {completedOrders.length === 0 ? (

                <p>
                    No completed orders yet.
                </p>

            ) : (

                completedOrders.map(
                    (order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <h3>
                                Order #
                                {order._id.slice(-6)}
                            </h3>

                            <p>
                                Restaurant:{" "}
                                {
                                    order.restaurant?.name
                                }
                            </p>

                            <p>
                                Customer:{" "}
                                {
                                    order.customer?.name
                                }
                            </p>

                            <p>
                                Delivery Address:{" "}
                                {
                                    order.deliveryAddress
                                }
                            </p>

                            <p>
                                Total: ₹
                                {
                                    order.totalAmount
                                }
                            </p>

                            <p>
                                Payment:{" "}
                                {
                                    order.paymentMethod
                                }
                            </p>

                            <p>
                                Status:{" "}
                                <strong>
                                    DELIVERED
                                </strong>
                            </p>

                        </div>

                    )
                )
            )}

        </div>
    );
};

export default Dashboard;