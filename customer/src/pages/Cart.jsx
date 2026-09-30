import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    getCart,
    updateCartItem,
    removeCartItem
} from "../api/cartApi.js";

const Cart = () => {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchCart = async () => {
        try {

            const data = await getCart();

            console.log("Cart response:", data);

            setCart(data.cart);

        } catch (error) {

            console.error("Cart error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load cart"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);


    const calculateSubtotal = () => {

        if (
            !cart ||
            !cart.items
        ) {
            return 0;
        }

        return cart.items.reduce(
            (total, item) => {

                return (
                    total +
                    item.menuItem.price *
                    item.quantity
                );

            },
            0
        );
    };


    const subtotal = calculateSubtotal();

    const deliveryFee =
        cart?.restaurant?.deliveryFee || 0;

    const total =
        subtotal + deliveryFee;


    const handleUpdateQuantity = async (
        menuItemId,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }

        try {

            await updateCartItem(menuItemId, newQuantity);

            await fetchCart();

        } catch (error) {

            console.error(
                "Update quantity error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    };


    const handleRemoveItem = async (
        menuItemId
    ) => {

        try {

            await removeCartItem(
                menuItemId
            );

            await fetchCart();

        } catch (error) {

            console.error(
                "Remove item error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to remove item"
            );
        }
    };



    if (loading) {
        return (
            <div className="page-container">

                <h2>
                    Loading cart...
                </h2>

            </div>
        );
    }

    if (error) {

        return (
            <div className="page-container">

                <h2>
                    Cart
                </h2>

                <p className="error-message">
                    {error}
                </p>

            </div>
        );
    }

    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {

        return (
            <div className="page-container">

                <div className="page-header">

                    <h1>
                        Your Cart 🛒
                    </h1>

                    <p>
                        Your cart is empty.
                    </p>

                </div>

                <Link
                    to="/restaurants"
                    className="cart-button"
                >
                    Browse Restaurants
                </Link>

            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">

                <h1>
                    Your Cart 🛒
                </h1>

                <p>
                    Review your selected items
                </p>

            </div>

            <div className="cart-container">

                {cart.items.map(
                    (item) => (

                        <div
                            className="cart-item"
                        >

                            <div>

                                <h2>
                                    {item.menuItem.name}
                                </h2>

                                <p>
                                    ₹
                                    {item.menuItem.price}
                                </p>

                                <div className="quantity-controls">

                                    <button
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                item.menuItem._id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                item.menuItem._id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    className="remove-button"
                                    onClick={() =>
                                        handleRemoveItem(
                                            item.menuItem._id
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                            <div>

                                <strong>
                                    ₹
                                    {item.menuItem.price *
                                        item.quantity}
                                </strong>

                            </div>

                        </div>
                    )
                )}

            </div>

            <div className="cart-summary">

                <h2>
                    Order Summary
                </h2>

                <div className="summary-row">

                    <span>
                        Subtotal
                    </span>

                    <span>
                        ₹{subtotal}
                    </span>

                </div>

                <div className="summary-row">

                    <span>
                        Delivery Fee
                    </span>

                    <span>
                        ₹{deliveryFee}
                    </span>

                </div>

                <hr />

                <div className="summary-row total-row">

                    <strong>
                        Total
                    </strong>

                    <strong>
                        ₹{total}
                    </strong>

                </div>

                <button
                    className="checkout-button"
                    onClick={() =>
                        navigate("/checkout")
                    }
                >
                    Proceed to Checkout
                </button>

            </div>

        </div>
    );
};

export default Cart;