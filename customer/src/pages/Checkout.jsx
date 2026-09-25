import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/orderApi.js";

const Checkout = () => {

    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!address.trim()) {

            setError(
                "Please enter delivery address"
            );

            return;
        }

        try {

            setLoading(true);

            setError("");

            const data = await createOrder({
                deliveryAddress: address,
                paymentMethod: paymentMethod
            });

            console.log("Order response:", data);

            alert(
                "Order placed successfully 🎉"
            );

            navigate("/orders");

        } catch (error) {

            console.error("Create order error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to place order"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="checkout-page">

            <h1>
                Checkout 🛍️
            </h1>

            {error && (
                <p>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Delivery Address
                    </label>

                    <textarea
                        value={address}
                        onChange={(event) =>
                            setAddress(
                                event.target.value
                            )
                        }
                        placeholder="Enter your delivery address"
                        rows="4"
                    />

                </div>

                <div>

                    <h3>
                        Payment Method
                    </h3>

                    <label>

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

                    <br />

                    <label>

                        <input
                            type="radio"
                            value="RAZORPAY"
                            checked={
                                paymentMethod ===
                                "RAZORPAY"
                            }
                            onChange={(event) =>
                                setPaymentMethod(
                                    event.target.value
                                )
                            }
                        />

                        Razorpay
                    </label>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Placing Order..."
                        : "Place Order"
                    }
                </button>

            </form>

        </div>
    );
};

export default Checkout;