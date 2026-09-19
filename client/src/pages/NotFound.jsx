import { Link } from "react-router-dom";

function NotFound() {
  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  const homePath = user?.isAdmin
    ? "/admin"
    : user
      ? "/dashboard"
      : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-6">
      <div className="text-center">

        <h1 className="text-7xl font-bold text-blue-600">
          404
        </h1>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to={homePath}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Go Back
        </Link>

      </div>
    </div>
  );
}

export default NotFound;