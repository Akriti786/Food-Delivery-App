import api from "./api.js";


// Get all restaurants
export const getAllRestaurantsAdmin =
    async () => {

        const response =
            await api.get(
                "/admin/restaurants"
            );

        return response.data;
    };


// Approve restaurant
export const approveRestaurant =
    async (restaurantId) => {

        const response =
            await api.patch(
                `/admin/restaurants/${restaurantId}/approve`
            );

        return response.data;
    };


// Reject restaurant
export const rejectRestaurant =
    async (restaurantId) => {

        const response =
            await api.patch(
                `/admin/restaurants/${restaurantId}/reject`
            );

        return response.data;
    };


// Open / close restaurant
export const updateRestaurantStatus =
    async (
        restaurantId,
        isOpen
    ) => {

        const response =
            await api.patch(
                `/admin/restaurants/${restaurantId}/status`,
                {
                    isOpen
                }
            );

        return response.data;
    };