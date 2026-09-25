import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Menu from "./pages/Menu.jsx";

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
        path: "menu",
        element: <Menu />
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