import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import {
    getRestaurantMenu
} from "../api/menuApi.js";
import {
    addToCart
} from "../api/cartApi.js";

const RestaurantMenu = () => {

    const {
        restaurantId
    } = useParams();

    const navigate = useNavigate();


    const [menuItems, setMenuItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const handleAddToCart = async (menuItemId) => {
        try {
            const data = await addToCart(menuItemId, 1);

            console.log("Cart response:", data);

            alert("Item added to cart successfully");

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add item to cart"
            );
        }
    };


    const fetchMenu = async () => {

        try {

            const data =
                await getRestaurantMenu(
                    restaurantId
                );

            console.log(
                "Restaurant menu:",
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

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchMenu();

    }, [restaurantId]);


    if (loading) {

        return (
            <div className="page-container">

                <h2>
                    Loading menu...
                </h2>

            </div>
        );
    }


    return (
        <div className="page-container">

            <button
                onClick={() =>
                    navigate("/restaurants")
                }
            >
                ← Back to Restaurants
            </button>


            <div className="page-header">

                <h1>
                    Restaurant Menu 🍽️
                </h1>

                <p>
                    Choose your food
                </p>

            </div>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {menuItems.length === 0 ? (

                <p>
                    No menu items available.
                </p>

            ) : (

                <div className="menu-grid">

                    {menuItems.map(
                        (item) => (

                            <div
                                className="customer-menu-card"
                                key={item._id}
                            >

                                <h2>
                                    {item.name}
                                </h2>

                                <p>
                                    {
                                        item.description
                                    }
                                </p>

                                <p>
                                    Category:{" "}

                                    {
                                        item.category?.name ||
                                        "Food"
                                    }
                                </p>

                                <h3>
                                    ₹{item.price}
                                </h3>

                                <p>
                                    {
                                        item.isVeg
                                            ? "🥗 Vegetarian"
                                            : "🍗 Non-Vegetarian"
                                    }
                                </p>

                                <p>
                                    {
                                        item.isAvailable
                                            ? "✅ Available"
                                            : "❌ Currently unavailable"
                                    }
                                </p>


                                {item.isAvailable && (

                                    <button
                                        onClick={() =>
                                            handleAddToCart(item._id)}
                                    >
                                        🛒 Add to Cart
                                    </button>
                                )}

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default RestaurantMenu;