import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import Categories from "./pages/Categories.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/",
    element: <Navbar />,
    children: [

      {
        index: true,
        element: <Dashboard />
      },

      {
        path: "restaurants",
        element: <Restaurants />
      },

      {
        path: "categories",
        element: <Categories />
      }

    ]
  }
]);

const App = () => {

  return (
    <RouterProvider
      router={router}
    />
  );
};

export default App;