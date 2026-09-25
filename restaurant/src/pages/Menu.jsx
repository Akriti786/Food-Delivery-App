import { useEffect, useState } from "react";

import {
    getMyMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../api/menuApi.js";

const Menu = () => {

    const [menuItems, setMenuItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        isVeg: false,
        isAvailable: true
    });

    const [editingId, setEditingId] =
        useState(null);


    // Get restaurant menu
    const fetchMenu = async () => {

        try {

            const data = await getMyMenu();

            console.log( "My menu:", data );

            setMenuItems(
                data.menuItems || []
            );

        } catch (error) {

            console.error(
                "Menu error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load menu"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchMenu();

    }, []);


    // Input change
    const handleChange = (event) => {

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


    // Add / Update
    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            if (editingId) {

                await updateMenuItem(
                    editingId,
                    {
                        ...formData,
                        price: Number(
                            formData.price
                        )
                    }
                );

                setMessage(
                    "Menu item updated successfully"
                );

            } else {

                await createMenuItem({
                    ...formData,
                    price: Number(
                        formData.price
                    )
                });

                setMessage(
                    "Menu item added successfully"
                );
            }

            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                isVeg: false,
                isAvailable: true
            });

            setEditingId(null);

            fetchMenu();

        } catch (error) {

            console.error(
                "Save menu error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to save menu item"
            );
        }
    };


    // Edit
    const handleEdit = (item) => {

        setEditingId(item._id);

        setFormData({
            name: item.name || "",
            description:
                item.description || "",
            price: item.price || "",
            category:
                item.category?._id ||
                item.category ||
                "",
            isVeg:
                item.isVeg || false,
            isAvailable:
                item.isAvailable !== false
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // Delete
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

            setMessage(
                "Menu item deleted successfully"
            );

            fetchMenu();

        } catch (error) {

            console.error(
                "Delete menu error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to delete menu item"
            );
        }
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

            <h1>
                Menu Management 🍽️
            </h1>

            <p>
                Add and manage your restaurant menu.
            </p>


            {message && (
                <p>
                    {message}
                </p>
            )}


            {/* FORM */}

            <div className="menu-form">

                <h2>
                    {editingId
                        ? "Edit Menu Item"
                        : "Add Menu Item"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Item name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={
                            formData.description
                        }
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category ID"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />

                    <label>

                        <input
                            type="checkbox"
                            name="isVeg"
                            checked={formData.isVeg}
                            onChange={handleChange}
                        />

                        Vegetarian

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={
                                formData.isAvailable
                            }
                            onChange={handleChange}
                        />

                        Available

                    </label>


                    <button type="submit">

                        {editingId
                            ? "Update Item"
                            : "Add Item"}

                    </button>

                </form>

            </div>


            {/* MENU LIST */}

            <h2>
                My Menu
            </h2>


            {menuItems.length === 0 ? (

                <p>
                    No menu items found.
                </p>

            ) : (

                <div>

                    {menuItems.map(
                        (item) => (

                            <div
                                className="menu-card"
                                key={item._id}
                            >

                                <h3>
                                    {item.name}
                                </h3>

                                <p>
                                    {
                                        item.description
                                    }
                                </p>

                                <p>
                                    Price: ₹
                                    {item.price}
                                </p>

                                <p>
                                    Category:{" "}
                                    {
                                        item.category?.name ||
                                        item.category
                                    }
                                </p>

                                <p>
                                    Type:{" "}
                                    {item.isVeg
                                        ? "Veg"
                                        : "Non-Veg"}
                                </p>

                                <p>
                                    Status:{" "}
                                    {item.isAvailable
                                        ? "Available"
                                        : "Unavailable"}
                                </p>


                                <button
                                    onClick={() =>
                                        handleEdit(
                                            item
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            item._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        )
                    )}

                </div>
            )}

        </div>
    );
};

export default Menu;