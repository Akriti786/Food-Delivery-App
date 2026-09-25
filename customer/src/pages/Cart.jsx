// import { useEffect, useState } from "react";

// import {
//     getCart
// } from "../api/cartApi.js";

// const Cart = () => {

//     const [cart, setCart] = useState(null);

//     const [loading, setLoading] = useState(true);

//     const [error, setError] = useState("");

//     useEffect(() => {

//         const fetchCart = async () => {

//             try {

//                 const data = await getCart();

//                 console.log(
//                     "Cart response:",
//                     data
//                 );

//                 setCart(data.cart);

//             } catch (error) {

//                 console.error(
//                     "Cart error:",
//                     error
//                 );

//                 setError(
//                     error.response?.data?.message ||
//                     "Failed to load cart"
//                 );

//             } finally {

//                 setLoading(false);

//             }
//         };

//         fetchCart();

//     }, []);

//     if (loading) {
//         return <h2>Loading cart...</h2>;
//     }

//     if (error) {
//         return <h2>{error}</h2>;
//     }

//     if (!cart || cart.items.length === 0) {

//         return (
//             <div>
//                 <h1>Your Cart 🛒</h1>

//                 <p>
//                     Your cart is empty.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="cart-page">

//             <h1>
//                 Your Cart 🛒
//             </h1>

//             <div className="cart-items">

//                 {cart.items.map((item) => (

//                     <div
//                         className="cart-item"
//                         key={item.menuItem._id}
//                     >

//                         <h2>
//                             {item.menuItem.name}
//                         </h2>

//                         <p>
//                             ₹{item.menuItem.price}
//                         </p>

//                         <p>
//                             Quantity:
//                             {" "}
//                             {item.quantity}
//                         </p>

//                         <p>
//                             Item Total: ₹
//                             {item.menuItem.price *
//                                 item.quantity}
//                         </p>

//                     </div>

//                 ))}

//             </div>

//             <div className="cart-summary">

//                 <h2>
//                     Bill Details
//                 </h2>

//                 <p>
//                     Subtotal: ₹{cart.subtotal}
//                 </p>

//                 <p>
//                     Delivery Fee: ₹
//                     {cart.deliveryFee}
//                 </p>

//                 <h2>
//                     Total: ₹{cart.totalAmount}
//                 </h2>

//                 <button>
//                     Proceed to Checkout
//                 </button>

//             </div>

//         </div>
//     );
// };

// export default Cart;


import { useEffect, useState } from "react";

import {
    getCart,
    updateCartItem,
    removeCartItem
} from "../api/cartApi.js";

import {
    useNavigate
} from "react-router-dom";

const Cart = () => {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchCart = async () => {

        try {

            const data = await getCart();

            console.log(
                "Cart response:",
                data
            );

            setCart(data.cart);

        } catch (error) {

            console.error(
                "Cart error:",
                error
            );

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

    const handleIncrease = async (item) => {

        try {

            await updateCartItem(
                item.menuItem._id,
                item.quantity + 1
            );

            fetchCart();

        } catch (error) {

            console.error(
                "Increase quantity error:",
                error
            );
        }
    };

    const handleDecrease = async (item) => {

        if (item.quantity <= 1) {
            return;
        }

        try {

            await updateCartItem(
                item.menuItem._id,
                item.quantity - 1
            );

            fetchCart();

        } catch (error) {

            console.error(
                "Decrease quantity error:",
                error
            );
        }
    };

    const handleRemove = async (menuItemId) => {

        try {

            await removeCartItem(
                menuItemId
            );

            fetchCart();

        } catch (error) {

            console.error(
                "Remove item error:",
                error
            );
        }
    };

    if (loading) {
        return <h2>Loading cart...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!cart || cart.items.length === 0) {

        return (
            <div>
                <h1>Your Cart 🛒</h1>

                <p>
                    Your cart is empty.
                </p>
            </div>
        );
    }

    const subtotal = cart.items.reduce(
        (total, item) => {

            return total +
                item.menuItem.price *
                item.quantity;

        },
        0
    );

    const deliveryFee =
        cart.restaurant?.deliveryFee || 0;

    const totalAmount =
        subtotal + deliveryFee;

    return (
        <div className="cart-page">

            <h1>
                Your Cart 🛒
            </h1>

            <div className="cart-items">

                {cart.items.map((item) => (

                    <div
                        className="cart-item"
                        key={item.menuItem._id}
                    >

                        <h2>
                            {item.menuItem.name}
                        </h2>

                        <p>
                            ₹{item.menuItem.price}
                        </p>

                        <div>

                            <button
                                onClick={() =>
                                    handleDecrease(item)
                                }
                            >
                                −
                            </button>

                            <span>
                                {" "}
                                {item.quantity}
                                {" "}
                            </span>

                            <button
                                onClick={() =>
                                    handleIncrease(item)
                                }
                            >
                                +
                            </button>

                        </div>

                        <p>
                            Item Total: ₹
                            {item.menuItem.price *
                                item.quantity}
                        </p>

                        <button
                            onClick={() =>
                                handleRemove(
                                    item.menuItem._id
                                )
                            }
                        >
                            🗑️ Remove
                        </button>

                    </div>

                ))}

            </div>

            <div className="cart-summary">

                <h2>
                    Bill Details
                </h2>

                <p>
                    Subtotal: ₹{subtotal}
                </p>

                <p>
                    Delivery Fee: ₹{deliveryFee}
                </p>

                <h2>
                    Total: ₹{totalAmount}
                </h2>

                <button
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