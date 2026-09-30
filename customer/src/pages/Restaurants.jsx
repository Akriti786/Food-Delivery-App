import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getRestaurants
} from "../api/restaurantApi.js";


const Restaurants = () => {

    const [restaurants, setRestaurants] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const fetchRestaurants = async () => {

        try {

            const data =
                await getRestaurants();

            console.log(
                "Restaurants:",
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


    if (loading) {

        return (
            <div className="page-container">

                <h2>
                    Loading restaurants...
                </h2>

            </div>
        );
    }


    return (
        <div className="page-container">

            <div className="page-header">

                <h1>
                    Restaurants 🍽️
                </h1>

                <p>
                    Choose a restaurant and explore
                    its menu
                </p>

            </div>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {restaurants.length === 0 ? (

                <p>
                    No restaurants available.
                </p>

            ) : (

                <div className="restaurant-grid">

                    {restaurants.map(
                        (restaurant) => (

                            <div
                                className="restaurant-card"
                                key={
                                    restaurant._id
                                }
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
                                    📍{" "}
                                    {
                                        restaurant.address
                                    }
                                </p>

                                <p>
                                    🍴{" "}
                                    {
                                        restaurant.cuisines?.join(
                                            ", "
                                        )
                                    }
                                </p>

                                <p>
                                    ⏱️{" "}
                                    {
                                        restaurant.deliveryTime
                                    }{" "}
                                    minutes
                                </p>

                                <p>
                                    🚚 Delivery Fee: ₹
                                    {
                                        restaurant.deliveryFee
                                    }
                                </p>

                                <Link
                                    to={`/restaurants/${restaurant._id}`}
                                >
                                    View Menu
                                </Link>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default Restaurants;