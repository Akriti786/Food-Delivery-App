import {
    useEffect,
    useState
} from "react";

import {
    getRestaurantOrders,
    updateOrderStatus
} from "../api/orderApi.js";


const Orders = () => {

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
                "Get restaurant orders error:",
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
        newStatus
    ) => {

        try {

            const data =
                await updateOrderStatus(
                    orderId,
                    newStatus
                );

            console.log(
                "Status updated:",
                data
            );

            // Refresh orders after update
            await fetchOrders();

        } catch (error) {

            console.error(
                "Update status error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );
        }
    };


    const getNextStatus = (
        currentStatus
    ) => {

        if (
            currentStatus === "PLACED"
        ) {
            return "ACCEPTED";
        }

        if (
            currentStatus === "ACCEPTED"
        ) {
            return "PREPARING";
        }

        if (
            currentStatus === "PREPARING"
        ) {
            return "READY";
        }

        return null;
    };


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
                    Orders 📦
                </h1>

                <p>
                    Manage customer orders
                </p>

            </div>


            {orders.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Customer orders will
                        appear here.
                    </p>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map(
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
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>


                                        <span className="order-status">
                                            {order.orderStatus}
                                        </span>

                                    </div>


                                    <div className="customer-info">

                                        <h3>
                                            Customer
                                        </h3>

                                        <p>
                                            Name:
                                            {" "}
                                            {order.customer?.name}
                                        </p>

                                        <p>
                                            Phone:
                                            {" "}
                                            {order.customer?.phone}
                                        </p>

                                        <p>
                                            Address:
                                            {" "}
                                            {order.deliveryAddress}
                                        </p>

                                    </div>


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

                                        <div>

                                            <span>
                                                Subtotal
                                            </span>

                                            <span>
                                                ₹
                                                {order.subtotal}
                                            </span>

                                        </div>


                                        <div>

                                            <span>
                                                Delivery Fee
                                            </span>

                                            <span>
                                                ₹
                                                {order.deliveryFee}
                                            </span>

                                        </div>


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

        </div>

    );
};


export default Orders;