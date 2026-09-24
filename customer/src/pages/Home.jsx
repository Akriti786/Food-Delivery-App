import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    return (
        <div>

            <h1>
                Food Delivery App 🍔
            </h1>

            <p>
                Order delicious food from your
                favourite restaurants.
            </p>

            <button
                onClick={() => navigate("/restaurants")}
            >
                Explore Restaurants
            </button>

        </div>
    );
};

export default Home;