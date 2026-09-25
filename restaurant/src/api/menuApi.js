import api from "./api.js";


// Get my restaurant's menu
export const getMyMenu = async () => {

    const response =
        await api.get(
            "/menu-items/my"
        );

    return response.data;
};


// Add menu item
export const createMenuItem = async (
    menuData
) => {

    const response =
        await api.post(
            "/menu-items",
            menuData
        );

    return response.data;
};


// Update menu item
export const updateMenuItem = async (
    menuItemId,
    menuData
) => {

    const response =
        await api.put(
            `/menu-items/${menuItemId}`,
            menuData
        );

    return response.data;
};


// Delete menu item
export const deleteMenuItem = async (
    menuItemId
) => {

    const response =
        await api.delete(
            `/menu-items/${menuItemId}`
        );

    return response.data;
};