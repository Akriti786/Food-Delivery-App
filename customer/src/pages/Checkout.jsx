import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";
import {
    createOrder
} from "../api/orderApi.js";

const Checkout = () => {

    const navigate = useNavigate();

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const orderData = {
                deliveryAddress,
                paymentMethod
            };

            console.log(
                "Creating order:",
                orderData
            );

            const data =
                await createOrder(orderData);

            console.log(
                "Order created:",
                data
            );

            alert(
                "Order placed successfully!"
            );

            navigate("/orders");

        } catch (error) {

            console.error(
                "Create order error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to place order"
            );
        }
    };



    return (
        <div className="page-container">

            <div className="page-header">

                <h1>
                    Checkout 🧾
                </h1>

                <p>
                    Enter your delivery details
                </p>

            </div>

            <div className="checkout-container">

                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        Delivery Address
                    </h2>

                    <textarea
                        value={deliveryAddress}
                        onChange={(event) =>
                            setDeliveryAddress(
                                event.target.value
                            )
                        }
                        placeholder="Enter your delivery address"
                        rows="4"
                        required
                    />

                    <h2>
                        Payment Method
                    </h2>

                    <label className="payment-option">

                        <input
                            type="radio"
                            value="COD"
                            checked={
                                paymentMethod === "COD"
                            }
                            onChange={(event) =>
                                setPaymentMethod(
                                    event.target.value
                                )
                            }
                        />

                        Cash on Delivery
                    </label>

                    <label className="payment-option">

                        <input
                            type="radio"
                            value="RAZORPAY"
                            checked={
                                paymentMethod === "RAZORPAY"
                            }
                            onChange={(event) =>
                                setPaymentMethod(
                                    event.target.value
                                )
                            }
                        />

                        Razorpay
                    </label>

                    <div className="checkout-actions">

                        <button
                            type="button"
                            className="back-button"
                            onClick={() =>
                                navigate("/cart")
                            }
                        >
                            ← Back to Cart
                        </button>

                        <button
                            type="submit"
                            className="checkout-button"
                        >
                            Place Order
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Checkout;