import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config/api";
import Navbar from "../components/Navbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Notifications
  // =========================
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        setError("Unable to load notifications.");
      }
    } catch (error) {
      console.log("Notification Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load Notifications
  // =========================
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchNotifications();
  }, []);

  // =========================
  // Mark Notification As Read
  // =========================
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotifications((previousNotifications) =>
          previousNotifications.map((notification) =>
            notification._id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
          )
        );
      }
    } catch (error) {
      console.log("Mark Read Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  // =========================
  // Loading
  // =========================
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
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        dark:bg-gray-950
        transition-colors
        duration-300
      "
    >
      {/* Navbar */}
      
      <Navbar />

      {/* Notifications Section */}
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h2
          className="
            text-3xl
            font-bold
            mb-2
            text-gray-900
            dark:text-white
          "
        >
          🔔 Notifications
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Check updates about your hostel complaints.
        </p>

        {/* Error */}
        {error && (
          <div
            className="
              bg-red-100
              dark:bg-red-900/40
              text-red-700
              dark:text-red-300
              p-4
              rounded-lg
              mb-6
            "
          >
            {error}
          </div>
        )}

        {/* No Notifications */}
        {!error && notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-10 text-center mt-6">

    <div className="text-5xl mb-4">
      🔔
    </div>

    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
      No Notifications
    </h2>

    <p className="text-gray-600 dark:text-gray-400 mt-2">
      Status updates for your complaints will appear here.
    </p>

  </div>
            
        ) : (
          /* Notification List */
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`
                  p-5
                  rounded-xl
                  shadow-md
                  transition-colors
                  duration-300
                  ${
                    notification.isRead
                      ? `
                        bg-white
                        dark:bg-gray-900
                        border
                        border-gray-200
                        dark:border-gray-800
                      `
                      : `
                        bg-blue-50
                        dark:bg-gray-800
                        border-l-4
                        border-blue-600
                      `
                  }
                `}
              >
                {/* Read / Unread Status */}
                <div className="flex justify-between items-start gap-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    {notification.message}
                  </p>

                  {!notification.isRead && (
                    <span
                      className="
                        bg-blue-100
                        dark:bg-blue-900
                        text-blue-700
                        dark:text-blue-300
                        text-xs
                        font-semibold
                        px-2
                        py-1
                        rounded-full
                      "
                    >
                      New
                    </span>
                  )}
                </div>

                {/* Date */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {notification.createdAt
                    ? new Date(
                        notification.createdAt
                      ).toLocaleString()
                    : "Date unavailable"}
                </p>

                {/* Complaint Information */}
                {notification.complaintId && (
                  <div
                    className="
                      mt-3
                      p-3
                      rounded-lg
                      bg-gray-100
                      dark:bg-gray-950
                    "
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Complaint:</strong>{" "}
                      {notification.complaintId.title}
                    </p>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      <strong>Status:</strong>{" "}
                      {notification.complaintId.status}
                    </p>
                  </div>
                )}

                {/* Mark As Read */}
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(notification._id)
                    }
                    className="
                      mt-4
                      bg-blue-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      font-semibold
                      hover:bg-blue-700
                      transition-colors
                    "
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;