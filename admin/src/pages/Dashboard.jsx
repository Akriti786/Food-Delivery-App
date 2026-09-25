import { useEffect, useState } from "react";

import {
    getAdminDashboard
} from "../api/adminApi.js";

const Dashboard = () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchDashboard = async () => {

        try {

            const data =
                await getAdminDashboard();

            console.log(
                "Admin dashboard:",
                data
            );

            setDashboard(data);

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchDashboard();

    }, []);

    if (loading) {

        return (
            <h2>
                Loading admin dashboard...
            </h2>
        );
    }

    return (
        <div className="admin-dashboard">

            <div className="dashboard-header">

                <h1>
                    Admin Dashboard 👨‍💼
                </h1>

                <p>
                    Welcome, {user?.name}
                </p>

            </div>

            {error && (
                <p>
                    {error}
                </p>
            )}

            {dashboard && (
                <div className="stats-container">

                    <div className="stat-card">

                        <h3>
                            👥 Users
                        </h3>

                        <p>
                            {dashboard.totalUsers}
                        </p>

                    </div>

                    <div className="stat-card">

                        <h3>
                            🍽️ Restaurants
                        </h3>

                        <p>
                            {dashboard.totalRestaurants}
                        </p>

                    </div>

                    <div className="stat-card">

                        <h3>
                            📦 Orders
                        </h3>

                        <p>
                            {dashboard.totalOrders}
                        </p>

                    </div>

                    <div className="stat-card">

                        <h3>
                            🚴 Delivery Partners
                        </h3>

                        <p>
                            {dashboard.totalDeliveryPartners}
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Dashboard;