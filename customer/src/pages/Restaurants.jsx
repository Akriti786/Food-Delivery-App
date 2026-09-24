import { useEffect, useState } from "react";

import { getRestaurants } from "../api/restaurantApi.js";
import { useNavigate } from "react-router-dom";



const Restaurants = () => {
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchRestaurants = async () => {

            try {

                const data = await getRestaurants();

                console.log(
                    "Restaurant response:",
                    data
                );

                setRestaurants(
                    data.restaurants
                );

            } catch (error) {

                console.error(
                    "Restaurant error:",
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

        fetchRestaurants();

    }, []);

    if (loading) {
        return <h2>Loading restaurants...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="restaurants-page">

            <h1>Restaurants</h1>

            <div className="restaurant-list">

                {restaurants.map((restaurant) => (

                    <div
                        className="restaurant-card"
                        key={restaurant._id}
                        onClick={() => navigate(`/restaurants/${restaurant._id}`)
                        }
                    >

                        <h2>
                            {restaurant.name}
                        </h2>

                        <p>
                            {restaurant.description}
                        </p>

                        <p>
                            📍 {restaurant.city}
                        </p>

                        <p>
                            🍴 {restaurant.cuisines?.join(", ")}
                        </p>

                        <p>
                            ⭐ {restaurant.rating}
                        </p>

                        <p>
                            🕒 {restaurant.deliveryTime} mins
                        </p>

                        <p>
                            🚚 ₹{restaurant.deliveryFee}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Restaurants;