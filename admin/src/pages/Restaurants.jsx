import {
    useEffect,
    useState
} from "react";

import {
    getAllRestaurantsAdmin,
    approveRestaurant,
    rejectRestaurant,
    updateRestaurantStatus
} from "../api/restaurantApi.js";

const Restaurants = () => {

    const [restaurants, setRestaurants] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================
    // FETCH RESTAURANTS
    // =========================

    const fetchRestaurants = async () => {

        try {

            const data =
                await getAllRestaurantsAdmin();

            console.log(
                "Admin restaurants:",
                data
            );

            setRestaurants(
                data.restaurants || []
            );

        } catch (error) {

            console.error(
                "Restaurants error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load restaurants"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchRestaurants();

    }, []);


    // =========================
    // APPROVE
    // =========================

    const handleApprove = async (
        restaurantId
    ) => {

        try {

            await approveRestaurant(
                restaurantId
            );

            alert(
                "Restaurant approved successfully"
            );

            fetchRestaurants();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to approve restaurant"
            );
        }
    };


    // =========================
    // REJECT
    // =========================

    const handleReject = async (
        restaurantId
    ) => {

        try {

            await rejectRestaurant(
                restaurantId
            );

            alert(
                "Restaurant rejected"
            );

            fetchRestaurants();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to reject restaurant"
            );
        }
    };


    // =========================
    // OPEN / CLOSE
    // =========================

    const handleStatusChange = async (
        restaurantId,
        isOpen
    ) => {

        try {

            await updateRestaurantStatus(
                restaurantId,
                isOpen
            );

            alert(
                isOpen
                    ? "Restaurant opened"
                    : "Restaurant closed"
            );

            fetchRestaurants();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update status"
            );
        }
    };


    if (loading) {

        return (
            <h2>
                Loading restaurants...
            </h2>
        );
    }


    return (
        <div className="admin-dashboard">

            <div className="dashboard-header">

                <h1>
                    Restaurants 🍽️
                </h1>

                <p>
                    Manage restaurant approvals
                    and status
                </p>

            </div>


            {error && (
                <p>
                    {error}
                </p>
            )}


            {restaurants.length === 0 ? (

                <p>
                    No restaurants found.
                </p>

            ) : (

                <div className="restaurant-list">

                    {restaurants.map(
                        (restaurant) => (

                            <div
                                className="restaurant-card"
                                key={restaurant._id}
                            >

                                <h2>
                                    {
                                        restaurant.name
                                    }
                                </h2>

                                <p>
                                    {
                                        restaurant.description
                                    }
                                </p>

                                <p>
                                    City:{" "}
                                    {
                                        restaurant.city
                                    }
                                </p>

                                <p>
                                    Address:{" "}
                                    {
                                        restaurant.address
                                    }
                                </p>

                                <p>
                                    Owner:{" "}
                                    {
                                        restaurant.owner?.name
                                    }
                                </p>

                                <p>
                                    Email:{" "}
                                    {
                                        restaurant.owner?.email
                                    }
                                </p>


                                <p>
                                    Approval:{" "}

                                    <strong>
                                        {
                                            restaurant.isApproved
                                                ? "Approved"
                                                : "Not Approved"
                                        }
                                    </strong>
                                </p>


                                <p>
                                    Status:{" "}

                                    <strong>
                                        {
                                            restaurant.isOpen
                                                ? "Open"
                                                : "Closed"
                                        }
                                    </strong>
                                </p>


                                <div className="restaurant-actions">

                                    {!restaurant.isApproved && (

                                        <button
                                            onClick={() =>
                                                handleApprove(
                                                    restaurant._id
                                                )
                                            }
                                        >
                                            ✅ Approve
                                        </button>

                                    )}


                                    {restaurant.isApproved && (

                                        <button
                                            onClick={() =>
                                                handleReject(
                                                    restaurant._id
                                                )
                                            }
                                        >
                                            ❌ Reject
                                        </button>

                                    )}


                                    {restaurant.isOpen ? (

                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    restaurant._id,
                                                    false
                                                )
                                            }
                                        >
                                            🔴 Close
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    restaurant._id,
                                                    true
                                                )
                                            }
                                        >
                                            🟢 Open
                                        </button>

                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>
            )}

        </div>
    );
};

export default Restaurants;