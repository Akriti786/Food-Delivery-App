import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    loginAdmin
} from "../api/authApi.js";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const data =
                await loginAdmin(formData);

            console.log(
                "Admin login:",
                data
            );

            if (
                data.user.role !== "admin"
            ) {

                setMessage(
                    "This account is not an admin account"
                );

                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/");

        } catch (error) {

            console.error(
                "Admin login error:",
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

            <h2>
                Admin Login 👨‍💼
            </h2>

            {message && (
                <p>
                    {message}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
            >

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