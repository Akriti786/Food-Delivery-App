import { Link, Outlet } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav className="navbar">

                <div className="navbar-logo">
                    🍔 Foodie
                </div>

                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>

                </div>

            </nav>

            <Outlet />
        </>
    );
};

export default Navbar;