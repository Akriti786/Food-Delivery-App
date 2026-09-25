import api from "./api";

export const getRestaurantOrders = async () => {

    const response = await api.get("/orders/restaurant");

    return response.data;
};


export const updateOrderStatus = async (orderId, orderStatus) => {

    const response = await api.patch(`/orders/restaurant/${orderId}/status`, {
        orderStatus
    });

    return response.data;
};
