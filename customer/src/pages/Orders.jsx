import {
    useEffect,
    useState
} from "react";

import {
    getMyOrders
} from "../api/orderApi.js";
import socket from "../socket.js";

const Orders = () => {

    // Store customer's orders
    const [orders, setOrders] = useState([]);

    // Loading state
    const [loading, setLoading] =
        useState(true);

    // Error message
    const [error, setError] =
        useState("");


    // Order status flow
    const orderStatuses = [
        "PLACED",
        "ACCEPTED",
        "PREPARING",
        "READY",
        "ASSIGNED",
        "PICKED_UP",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
    ];


    // Fetch customer's orders
    const fetchOrders = async () => {

        try {

            setError("");

            const data =
                await getMyOrders();

            console.log(
                "My orders:",
                data
            );

            setOrders(
                data.orders || []
            );

        } catch (error) {

            console.error(
                "Get orders error:",
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


    // Get position of current status
    const getStatusIndex = (
        currentStatus
    ) => {

        return orderStatuses.indexOf(
            currentStatus
        );
    };


    // Fetch orders when page opens
    // useEffect(() => {
    //     fetchOrders();
    //     socket.connect();
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    useEffect(() => {

        fetchOrders();

        socket.connect();


        socket.on(
            "orderStatusUpdated",
            (updatedOrder) => {

                console.log(
                    "Order status updated:",
                    updatedOrder
                );


                setOrders(
                    (currentOrders) => {

                        return currentOrders.map(
                            (order) => {

                                if (
                                    order._id ===
                                    updatedOrder._id
                                ) {

                                    return {
                                        ...order,
                                        ...updatedOrder
                                    };

                                }

                                return order;

                            }
                        );

                    }
                );

            }
        );


        return () => {

            socket.off(
                "orderStatusUpdated"
            );

            socket.disconnect();

        };

    }, []);

    // Loading screen
    if (loading) {

        return (
            <div className="page-container">

                <h2>
                    Loading orders...
                </h2>

            </div>
        );
    }


    // Error screen
    if (error) {

        return (
            <div className="page-container">

                <p className="error-message">
                    {error}
                </p>

                <button
                    className="refresh-orders-button"
                    onClick={fetchOrders}
                >
                    🔄 Try Again
                </button>

            </div>
        );
    }


    return (

        <div className="page-container">

            {/* PAGE HEADER */}

            <div className="page-header">

                <h1>
                    My Orders 📦
                </h1>

                <p>
                    View your order history
                </p>

                <button
                    className="refresh-orders-button"
                    onClick={fetchOrders}
                >
                    🔄 Refresh Orders
                </button>

            </div>


            {/* NO ORDERS */}

            {orders.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Your placed orders will
                        appear here.
                    </p>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map(
                        (order) => {

                            const currentIndex =
                                getStatusIndex(
                                    order.orderStatus
                                );


                            return (

                                <div
                                    className="order-card"
                                    key={order._id}
                                >

                                    {/* ORDER HEADER */}

                                    <div className="order-header">

                                        <div>

                                            <h2>
                                                Order #
                                                {order._id.slice(-6)}
                                            </h2>

                                            <p>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>


                                        <span className="order-status">

                                            {
                                                order.orderStatus
                                            }

                                        </span>

                                    </div>


                                    {/* STATUS TIMELINE */}

                                    <div className="order-timeline">

                                        {orderStatuses.map(
                                            (
                                                status,
                                                index
                                            ) => {

                                                const isCompleted =
                                                    index <=
                                                    currentIndex;

                                                const isCurrent =
                                                    status ===
                                                    order.orderStatus;


                                                return (

                                                    <div
                                                        className={
                                                            `timeline-step ${isCompleted
                                                                ? "completed"
                                                                : ""
                                                            } ${isCurrent
                                                                ? "current"
                                                                : ""
                                                            }`
                                                        }
                                                        key={status}
                                                    >

                                                        <div className="timeline-dot">

                                                            {
                                                                isCompleted
                                                                    ? "✓"
                                                                    : index + 1
                                                            }

                                                        </div>

                                                        <span>
                                                            {status}
                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>


                                    {/* REJECTED */}

                                    {order.orderStatus ===
                                        "REJECTED" && (

                                            <div className="special-order-status rejected">

                                                ❌ This order was rejected
                                                by the restaurant.

                                            </div>

                                        )}


                                    {/* CANCELLED */}

                                    {order.orderStatus ===
                                        "CANCELLED" && (

                                            <div className="special-order-status cancelled">

                                                ⚠️ This order was cancelled.

                                            </div>

                                        )}


                                    {/* RESTAURANT */}

                                    <div className="order-restaurant">

                                        <strong>
                                            Restaurant
                                        </strong>

                                        <p>
                                            {
                                                order.restaurant?.name
                                            }
                                        </p>

                                    </div>


                                    {/* ITEMS */}

                                    <div className="order-items">

                                        <h3>
                                            Items
                                        </h3>


                                        {order.items.map(
                                            (item) => (

                                                <div
                                                    className="order-item"
                                                    key={
                                                        item._id ||
                                                        item.menuItem
                                                    }
                                                >

                                                    <span>

                                                        {item.name}

                                                        {" × "}

                                                        {
                                                            item.quantity
                                                        }

                                                    </span>


                                                    <span>

                                                        ₹
                                                        {
                                                            item.price *
                                                            item.quantity
                                                        }

                                                    </span>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* ORDER SUMMARY */}

                                    <div className="order-summary">

                                        <div>

                                            <span>
                                                Subtotal
                                            </span>

                                            <span>
                                                ₹
                                                {
                                                    order.subtotal
                                                }
                                            </span>

                                        </div>


                                        <div>

                                            <span>
                                                Delivery Fee
                                            </span>

                                            <span>
                                                ₹
                                                {
                                                    order.deliveryFee
                                                }
                                            </span>

                                        </div>


                                        <div>

                                            <span>
                                                Discount
                                            </span>

                                            <span>
                                                - ₹
                                                {
                                                    order.discount
                                                }
                                            </span>

                                        </div>


                                        <hr />


                                        <div className="order-total">

                                            <strong>
                                                Total
                                            </strong>

                                            <strong>
                                                ₹
                                                {
                                                    order.totalAmount
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* PAYMENT INFORMATION */}

                                    <div className="payment-info">

                                        <p>
                                            <strong>
                                                Payment:
                                            </strong>
                                            {" "}
                                            {
                                                order.paymentMethod
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Payment Status:
                                            </strong>
                                            {" "}
                                            {
                                                order.paymentStatus
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Delivery Address:
                                            </strong>
                                            {" "}
                                            {
                                                order.deliveryAddress
                                            }
                                        </p>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            )}

        </div>

    );
};


export default Orders;