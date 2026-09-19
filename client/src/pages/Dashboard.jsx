import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // =====================================
  // Fetch User Profile
  // =====================================
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }
    } catch (error) {
      console.log("Profile Error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Fetch Unread Notification Count
  // =====================================
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.log(
        "Unread Notification Error:",
        error
      );
    }
  };

  // =====================================
  // Load Dashboard
  // =====================================
  useEffect(() => {
    fetchProfile();
    fetchUnreadCount();
  }, []);

  // =====================================
  // Logout
  // =====================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =====================================
  // Loading
  // =====================================
  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-100
          dark:bg-gray-950
        "
      >
        <p className="text-xl text-gray-800 dark:text-white">
          Loading...
        </p>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
    

      {/* =====================================
          Navbar
      ===================================== */}
     
     <Navbar />
      {/* =====================================
          Dashboard
      ===================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2
          className="
            text-3xl
            font-bold
            text-gray-800
            dark:text-white
          "
        >
          Welcome, {user?.name}! 👋
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to your HostelCare dashboard.
        </p>

        {/* =====================================
            Profile
        ===================================== */}
        <div
          className="
            bg-white
            dark:bg-gray-900
            dark:text-white
            rounded-xl
            shadow-md
            p-6
            mt-8
            border
            border-transparent
            dark:border-gray-800
          "
        >
          <h3 className="text-xl font-bold mb-4">
            My Profile
          </h3>

          <p className="mb-2">
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        {/* =====================================
            Dashboard Cards
        ===================================== */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            mt-8
          "
        >
          {/* Submit Complaint */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              p-6
              rounded-xl
              shadow-md
              border
              border-transparent
              dark:border-gray-800
            "
          >
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              📝 Submit Complaint
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Report a problem in your hostel.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/complaint";
              }}
              className="
                mt-4
                bg-blue-600
                text-white
                px-5
                py-2
                rounded-lg
                hover:bg-blue-700
              "
            >
              Submit Complaint
            </button>
          </div>

          {/* My Complaints */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              p-6
              rounded-xl
              shadow-md
              border
              border-transparent
              dark:border-gray-800
            "
          >
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
              📋 My Complaints
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View the complaints you have submitted.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/my-complaints";
              }}
              className="
                mt-4
                bg-green-600
                text-white
                px-5
                py-2
                rounded-lg
                hover:bg-green-700
              "
            >
              View Complaints
            </button>
          </div>

          {/* =====================================
              Notifications
          ===================================== */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              p-6
              rounded-xl
              shadow-md
              border
              border-transparent
              dark:border-gray-800
            "
          >
            {/* Heading + Badge */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                🔔 Notifications
              </h3>

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span
                  className="
                    bg-red-600
                    text-white
                    text-xs
                    font-bold
                    min-w-6
                    h-6
                    px-2
                    flex
                    items-center
                    justify-center
                    rounded-full
                  "
                >
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Check updates about your complaint status.
            </p>

            {/* Unread Message */}
            {unreadCount > 0 ? (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-semibold">
                You have {unreadCount} unread{" "}
                {unreadCount === 1
                  ? "notification"
                  : "notifications"}.
              </p>
            ) : (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                You're all caught up!
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/notifications";
              }}
              className="
                mt-4
                bg-purple-600
                text-white
                px-5
                py-2
                rounded-lg
                hover:bg-purple-700
              "
            >
              View Notifications
              {unreadCount > 0 &&
                ` (${unreadCount})`}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;