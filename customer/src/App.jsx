import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import RestaurantMenu from "./pages/RestaurantMenu.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [

      {
        index: true,
        element: <Home />
      },

      {
        path: "login",
        element: <Login />
      },

      {
        path: "register",
        element: <Register />
      },

      {
        path: "restaurants",
        element: <Restaurants />
      },

      {
        path: "restaurants/:restaurantId",
        element: <RestaurantMenu />
      },

      
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;