import {
    Link,
    Outlet,
    useNavigate
} from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    const token =
        localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <>
            <nav className="navbar">

                <div className="navbar-logo">

                    🍔 AkrGo

                    <p className="logo-text">
                        Admin Panel
                    </p>

                </div>

                <div className="navbar-links">

                    {token && (
                        <>
                            <Link to="/">
                                Dashboard
                            </Link>

                            <Link to="/categories">
                                Categories
                            </Link>

                            <span>
                                Admin
                            </span>

                            <span>
                                Hi, {user?.name}
                            </span>

                            <button
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {!token && (
                        <Link to="/login">
                            Login
                        </Link>
                    )}

                </div>

            </nav>

            <Outlet />

        </>
    );
};

export default Navbar;