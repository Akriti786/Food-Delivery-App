import api from "./api.js";

// Get all categories
export const getCategories = async () => {

    const response =
        await api.get(
            "/categories"
        );

    return response.data;
};


// Create category
export const createCategory = async (
    categoryData
) => {

    const response =
        await api.post(
            "/categories",
            categoryData
        );

    return response.data;
};


// Update category
export const updateCategory = async (
    categoryId,
    categoryData
) => {

    const response =
        await api.put(
            `/categories/${categoryId}`,
            categoryData
        );

    return response.data;
};


// Delete category
export const deleteCategory = async (
    categoryId
) => {

    const response =
        await api.delete(
            `/categories/${categoryId}`
        );

    return response.data;
};