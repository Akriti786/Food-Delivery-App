import api from "./api.js";


// Get orders that are READY
// and not assigned to any delivery partner
export const getReadyOrders = async () => {

    const response = await api.get(
        "/delivery/ready-orders"
    );

    return response.data;
};


// Get orders assigned to
// the logged-in delivery partner
export const getMyOrders = async () => {

    const response = await api.get(
        "/delivery/my-orders"
    );

    return response.data;
};


// Assign an available order
export const assignOrder = async (
    orderId
) => {

    const response = await api.patch(
        `/delivery/assign/${orderId}`
    );

    return response.data;
};


// Update delivery order status
export const updateDeliveryOrderStatus = async (
    orderId,
    orderStatus
) => {

    const response = await api.patch(
        `/delivery/order/${orderId}/status`,
        {
            orderStatus
        }
    );

    return response.data;
};