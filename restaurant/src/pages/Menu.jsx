import {
    useEffect,
    useState
} from "react";

import {
    getMyMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../api/menuApi.js";

import {
    getCategories
} from "../api/categoryApi.js";


const Menu = () => {

    const [menuItems, setMenuItems] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);


    const [formData, setFormData] =
        useState({
            name: "",
            description: "",
            price: "",
            category: "",
            isVeg: true,
            isAvailable: true
        });


    // =========================
    // FETCH MENU
    // =========================

    const fetchMenu = async () => {

        try {

            const data =
                await getMyMenu();

            console.log(
                "My menu:",
                data
            );

            setMenuItems(
                data.menuItems || []
            );

        } catch (error) {

            console.error(
                "Menu error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load menu"
            );
        }
    };


    // =========================
    // FETCH CATEGORIES
    // =========================

    const fetchCategories = async () => {

        try {

            const data =
                await getCategories();

            console.log(
                "Categories:",
                data
            );

            setCategories(
                data.categories || []
            );

        } catch (error) {

            console.error(
                "Categories error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load categories"
            );
        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchMenu(),
                fetchCategories()
            ]);

            setLoading(false);
        };

        loadData();

    }, []);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    };


    // =========================
    // ADD / UPDATE
    // =========================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");


        if (
            !formData.name.trim()
        ) {

            setError(
                "Food name is required"
            );

            return;
        }


        if (
            !formData.price ||
            Number(formData.price) <= 0
        ) {

            setError(
                "Enter a valid price"
            );

            return;
        }


        if (!formData.category) {

            setError(
                "Please select a category"
            );

            return;
        }


        try {

            const menuData = {

                name: formData.name,

                description:
                    formData.description,

                price:
                    Number(formData.price),

                category:
                    formData.category,

                isVeg:
                    formData.isVeg,

                isAvailable:
                    formData.isAvailable
            };


            if (editingId) {

                await updateMenuItem(
                    editingId,
                    menuData
                );

                alert(
                    "Menu item updated successfully"
                );

            } else {

                await createMenuItem(
                    menuData
                );

                alert(
                    "Menu item added successfully"
                );
            }


            resetForm();

            fetchMenu();

        } catch (error) {

            console.error(
                "Menu save error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save menu item"
            );
        }
    };


    // =========================
    // EDIT
    // =========================

    const handleEdit = (
        item
    ) => {

        setEditingId(
            item._id
        );

        setFormData({

            name:
                item.name || "",

            description:
                item.description || "",

            price:
                item.price || "",

            category:
                item.category?._id ||
                item.category ||
                "",

            isVeg:
                item.isVeg ?? true,

            isAvailable:
                item.isAvailable ?? true
        });

        setError("");
    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (
        menuItemId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this menu item?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await deleteMenuItem(
                menuItemId
            );

            alert(
                "Menu item deleted successfully"
            );

            fetchMenu();

        } catch (error) {

            console.error(
                "Delete menu error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete menu item"
            );
        }
    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({

            name: "",
            description: "",
            price: "",
            category: "",
            isVeg: true,
            isAvailable: true

        });

        setEditingId(null);
    };


    if (loading) {

        return (
            <h2>
                Loading menu...
            </h2>
        );
    }


    return (
        <div className="menu-page">

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div className="dashboard-header">

                <h1>
                    Menu Management 🍽️
                </h1>

                <p>
                    Add and manage your restaurant menu
                </p>

            </div>


            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* ========================= */}
            {/* FORM */}
            {/* ========================= */}

            <div className="menu-form-card">

                <h2>
                    {editingId
                        ? "Edit Menu Item"
                        : "Add Menu Item"}
                </h2>


                <form
                    onSubmit={handleSubmit}
                >

                    {/* FOOD NAME */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Food name"
                        value={formData.name}
                        onChange={
                            handleChange
                        }
                    />


                    {/* DESCRIPTION */}

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                    />


                    {/* PRICE */}

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={
                            formData.price
                        }
                        onChange={
                            handleChange
                        }
                    />


                    {/* CATEGORY */}

                    <select
                        name="category"
                        value={
                            formData.category
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="">
                            Select Category
                        </option>

                        {categories.map(
                            (category) => (

                                <option
                                    key={
                                        category._id
                                    }
                                    value={
                                        category._id
                                    }
                                >
                                    {
                                        category.name
                                    }
                                </option>

                            )
                        )}

                    </select>


                    {/* VEG */}

                    <label className="checkbox-label">

                        <input
                            type="checkbox"
                            name="isVeg"
                            checked={
                                formData.isVeg
                            }
                            onChange={
                                handleChange
                            }
                        />

                        Vegetarian

                    </label>


                    {/* AVAILABLE */}

                    <label className="checkbox-label">

                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={
                                formData.isAvailable
                            }
                            onChange={
                                handleChange
                            }
                        />

                        Available

                    </label>


                    {/* BUTTONS */}

                    <div className="menu-form-actions">

                        <button
                            type="submit"
                        >
                            {editingId
                                ? "Update Item"
                                : "Add Item"}
                        </button>


                        {editingId && (

                            <button
                                type="button"
                                onClick={
                                    resetForm
                                }
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* ========================= */}
            {/* MENU LIST */}
            {/* ========================= */}

            <h2 className="menu-list-title">
                Your Menu
            </h2>


            {menuItems.length === 0 ? (

                <p>
                    No menu items found.
                </p>

            ) : (

                <div className="menu-list">

                    {menuItems.map(
                        (item) => (

                            <div
                                className="menu-card"
                                key={
                                    item._id
                                }
                            >

                                <div>

                                    <h3>
                                        {
                                            item.name
                                        }
                                    </h3>

                                    <p>
                                        {
                                            item.description
                                        }
                                    </p>

                                    <p>
                                        Category:{" "}

                                        {
                                            item.category?.name ||
                                            "Unknown"
                                        }
                                    </p>

                                    <p>
                                        Price: ₹
                                        {
                                            item.price
                                        }
                                    </p>

                                    <p>
                                        Type:{" "}

                                        {
                                            item.isVeg
                                                ? "Vegetarian 🥗"
                                                : "Non-Vegetarian 🍗"
                                        }
                                    </p>

                                    <p>
                                        Status:{" "}

                                        {
                                            item.isAvailable
                                                ? "Available"
                                                : "Unavailable"
                                        }
                                    </p>

                                </div>


                                <div className="menu-actions">

                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                item
                                            )
                                        }
                                    >
                                        ✏️ Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                item._id
                                            )
                                        }
                                    >
                                        🗑️ Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default Menu;