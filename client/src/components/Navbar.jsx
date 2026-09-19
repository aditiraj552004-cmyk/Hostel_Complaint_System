import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isAdmin = user?.isAdmin === true;

  const handleLogout = () => {
    // Do NOT use localStorage.clear()
    // because we want to preserve the theme.
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const linkClass = (path) => {
    const active = location.pathname === path;

    return `
      px-3 py-2
      rounded-lg
      text-sm
      font-semibold
      transition-colors
      ${
        active
          ? "bg-white text-blue-600 dark:bg-blue-600 dark:text-white"
          : "text-white hover:bg-blue-500 dark:hover:bg-gray-700"
      }
    `;
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to={isAdmin ? "/admin" : "/dashboard"}
            className="text-2xl font-bold"
          >
            🏠 Amma Chandrawati Hostel
          </Link>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-2">

            {!isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={linkClass("/dashboard")}
                >
                  Dashboard
                </Link>

                <Link
                  to="/complaint"
                  className={linkClass("/complaint")}
                >
                  Submit
                </Link>

                <Link
                  to="/my-complaints"
                  className={linkClass("/my-complaints")}
                >
                  My Complaints
                </Link>

                <Link
                  to="/notifications"
                  className={linkClass("/notifications")}
                >
                  Notifications
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={linkClass("/admin")}
              >
                Admin Dashboard
              </Link>
            )}

            <ThemeToggle />

            <button
              type="button"
              onClick={handleLogout}
              className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-4 py-2
                rounded-lg
                text-sm
                font-semibold
                transition-colors
              "
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;