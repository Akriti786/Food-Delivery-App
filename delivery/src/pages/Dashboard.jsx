import {
    useEffect,
    useState
} from "react";

import {
    getReadyOrders,
    getMyOrders,
    assignOrder,
    updateDeliveryOrderStatus
} from "../api/deliveryApi.js";


const Dashboard = () => {

    const [readyOrders, setReadyOrders] =
        useState([]);

    const [myOrders, setMyOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const fetchOrders = async () => {

        try {

            const [
                readyData,
                myData
            ] = await Promise.all([

                getReadyOrders(),

                getMyOrders()

            ]);


            console.log(
                "Ready orders:",
                readyData
            );

            console.log(
                "My orders:",
                myData
            );


            setReadyOrders(
                readyData.orders || []
            );

            setMyOrders(
                myData.orders || []
            );

        } catch (error) {

            console.error(
                "Get delivery orders error:",
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


    const handleAssignOrder = async (
        orderId
    ) => {

        try {

            const data =
                await assignOrder(
                    orderId
                );

            console.log(
                "Order assigned:",
                data
            );

            alert(
                "Order assigned successfully"
            );

            await fetchOrders();

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


    const getNextStatus = (
        currentStatus
    ) => {

        if (
            currentStatus === "ASSIGNED"
        ) {
            return "PICKED_UP";
        }

        if (
            currentStatus === "PICKED_UP"
        ) {
            return "OUT_FOR_DELIVERY";
        }

        if (
            currentStatus ===
            "OUT_FOR_DELIVERY"
        ) {
            return "DELIVERED";
        }

        return null;
    };


    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {

        try {

            const data =
                await updateDeliveryOrderStatus(
                    orderId,
                    newStatus
                );

            console.log(
                "Delivery status updated:",
                data
            );

            alert(
                `Order marked as ${newStatus}`
            );

            await fetchOrders();

        } catch (error) {

            console.error(
                "Update delivery status error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );
        }
    };


    const activeOrders =
        myOrders.filter(
            (order) =>
                [
                    "ASSIGNED",
                    "PICKED_UP",
                    "OUT_FOR_DELIVERY"
                ].includes(
                    order.orderStatus
                )
        );


    const completedOrders =
        myOrders.filter(
            (order) =>
                order.orderStatus ===
                "DELIVERED"
        );


    if (loading) {

        return (
            <div className="page-container">

                <h2>
                    Loading orders...
                </h2>

            </div>
        );
    }


    if (error) {

        return (
            <div className="page-container">

                <p className="error-message">
                    {error}
                </p>

            </div>
        );
    }


    return (

        <div className="page-container">

            <div className="page-header">

                <h1>
                    Delivery Dashboard 🚚
                </h1>

                <p>
                    Manage your delivery orders
                </p>

            </div>


            {/* AVAILABLE ORDERS */}

            <section className="delivery-section">

                <h2>
                    Available Orders
                </h2>

                <p className="section-description">
                    Orders ready for pickup
                </p>


                {readyOrders.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No orders are currently
                            ready for pickup.
                        </p>

                    </div>

                ) : (

                    <div className="orders-list">

                        {readyOrders.map(
                            (order) => (

                                <div
                                    className="order-card"
                                    key={order._id}
                                >

                                    <div className="order-header">

                                        <div>

                                            <h2>
                                                Order #
                                                {order._id.slice(-6)}
                                            </h2>

                                            <p>
                                                {order.restaurant?.name}
                                            </p>

                                        </div>


                                        <span className="order-status">
                                            {order.orderStatus}
                                        </span>

                                    </div>


                                    <div className="order-items">

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
                                                        {" "}×{" "}
                                                        {item.quantity}
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


                                    <div className="order-summary">

                                        <div className="order-total">

                                            <strong>
                                                Total
                                            </strong>

                                            <strong>
                                                ₹
                                                {order.totalAmount}
                                            </strong>

                                        </div>

                                    </div>


                                    <button
                                        className="status-button"
                                        onClick={() =>
                                            handleAssignOrder(
                                                order._id
                                            )
                                        }
                                    >
                                        Assign Order
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* ACTIVE ORDERS */}

            <section className="delivery-section">

                <h2>
                    Active Orders
                </h2>

                <p className="section-description">
                    Orders currently being delivered
                </p>


                {activeOrders.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No active deliveries.
                        </p>

                    </div>

                ) : (

                    <div className="orders-list">

                        {activeOrders.map(
                            (order) => {

                                const nextStatus =
                                    getNextStatus(
                                        order.orderStatus
                                    );


                                return (

                                    <div
                                        className="order-card"
                                        key={order._id}
                                    >

                                        <div className="order-header">

                                            <div>

                                                <h2>
                                                    Order #
                                                    {order._id.slice(-6)}
                                                </h2>

                                                <p>
                                                    {
                                                        order.restaurant?.name
                                                    }
                                                </p>

                                            </div>


                                            <span className="order-status">
                                                {
                                                    order.orderStatus
                                                }
                                            </span>

                                        </div>


                                        <div className="customer-info">

                                            <p>
                                                Customer:
                                                {" "}
                                                {
                                                    order.customer?.name
                                                }
                                            </p>

                                            <p>
                                                Phone:
                                                {" "}
                                                {
                                                    order.customer?.phone
                                                }
                                            </p>

                                            <p>
                                                Address:
                                                {" "}
                                                {
                                                    order.deliveryAddress
                                                }
                                            </p>

                                        </div>


                                        <div className="order-items">

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
                                                            {" "}×{" "}
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


                                        {nextStatus && (

                                            <button
                                                className="status-button"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        order._id,
                                                        nextStatus
                                                    )
                                                }
                                            >
                                                Mark as{" "}
                                                {nextStatus}
                                            </button>

                                        )}

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </section>


            {/* COMPLETED ORDERS */}

            <section className="delivery-section">

                <h2>
                    Order History
                </h2>

                <p className="section-description">
                    Completed deliveries
                </p>


                {completedOrders.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No completed deliveries yet.
                        </p>

                    </div>

                ) : (

                    <div className="orders-list">

                        {completedOrders.map(
                            (order) => (

                                <div
                                    className="order-card"
                                    key={order._id}
                                >

                                    <div className="order-header">

                                        <div>

                                            <h2>
                                                Order #
                                                {order._id.slice(-6)}
                                            </h2>

                                            <p>
                                                {
                                                    order.restaurant?.name
                                                }
                                            </p>

                                        </div>


                                        <span className="order-status">
                                            DELIVERED
                                        </span>

                                    </div>


                                    <p>
                                        Customer:
                                        {" "}
                                        {
                                            order.customer?.name
                                        }
                                    </p>


                                    <p>
                                        Total:
                                        {" "}
                                        ₹
                                        {
                                            order.totalAmount
                                        }
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );
};


export default Dashboard;