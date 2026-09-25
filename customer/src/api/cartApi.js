import api from "./api";

export const addToCart = async (menuItemId, quantity = 1) => {

    const response = await api.post("/cart/add", {
        menuItemId,
        quantity
    });

    return response.data;
}



export const getCart = async () => {

    const response = await api.get("/cart");

    return response.data;
};


export const updateCartItem = async (
    menuItemId,
    quantity
) => {

    const response = await api.put(
        `/cart/item/${menuItemId}`,
        {
            quantity
        }
    );

    return response.data;
};

export const removeCartItem = async (
    menuItemId
) => {

    const response = await api.delete(
        `/cart/item/${menuItemId}`
    );

    return response.data;
};