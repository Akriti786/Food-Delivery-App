import api from "./api";

export const getRestaurantMenu = async (restaurantId) => {

    const response = await api.get(`/menu-items/restaurant/${restaurantId}`);

    return response.data;
}