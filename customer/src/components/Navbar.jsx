import {
    Link,
    Outlet,
    useNavigate
} from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

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
                        Order. Eat. Go
                    </p>
                </div>

                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    {!token && (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}

                    {token && (
                        <>
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

                </div>

            </nav>

            <Outlet />
        </>
    );
};

export default Navbar;