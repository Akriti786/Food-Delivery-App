import { useEffect, useState } from "react";

import {
    useParams
} from "react-router-dom";

import {
    getRestaurantMenu
} from "../api/menuApi.js";

const RestaurantMenu = () => {

    const { restaurantId } = useParams();

    const [menuItems, setMenuItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchMenu = async () => {

            try {

                const data =
                    await getRestaurantMenu(
                        restaurantId
                    );

                console.log(
                    "Menu response:",
                    data
                );

                setMenuItems(
                    data.menuItems
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

            } finally {

                setLoading(false);

            }
        };

        fetchMenu();

    }, [restaurantId]);

    if (loading) {
        return <h2>Loading menu...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="menu-page">

            <h1>
                Restaurant Menu
            </h1>

            <div className="menu-list">

                {menuItems.map((item) => (

                    <div
                        className="menu-card"
                        key={item._id}
                    >

                        <h2>
                            {item.name}
                        </h2>

                        <p>
                            {item.description}
                        </p>

                        <p>
                            ₹{item.price}
                        </p>

                        <p>
                            {item.isVeg
                                ? "🟢 Veg"
                                : "🔴 Non-Veg"
                            }
                        </p>

                        <p>
                            {item.isAvailable
                                ? "Available"
                                : "Currently unavailable"
                            }
                        </p>

                        <button>
                            Add to Cart
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default RestaurantMenu;