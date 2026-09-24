import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi.js";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const data = await loginUser(formData);

            console.log("Login response:", data);

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save user information
            localStorage.setItem("user",
                JSON.stringify(data.user)
            );

            setMessage("Login successful");

            setTimeout(() => {
                navigate("/");
            }, 500);

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-container">

            <h2>Login</h2>

            {message && (
                <p>{message}</p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
};

export default Login;