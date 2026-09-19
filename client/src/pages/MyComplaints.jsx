import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_URL from "../config/api";

function MyComplaints() {
  // ========================================
  // STATES
  // ========================================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ========================================
  // GET USER COMPLAINTS
  // ========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        `${API_URL}/complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComplaints(
          response.data.complaints || []
        );
      }
    } catch (error) {
      console.log(
        "Fetch Complaints Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FETCH ON PAGE LOAD
  // ========================================

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ========================================
  // DELETE COMPLAINT
  // ========================================

  const deleteComplaint = async (
    complaintId
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(complaintId);

      const token =
        localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.delete(
        `${API_URL}/complaints/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove deleted complaint
        // without refreshing page
        setComplaints(
          (previousComplaints) =>
            previousComplaints.filter(
              (complaint) =>
                complaint._id !==
                complaintId
            )
        );

        alert(
          "Complaint deleted successfully!"
        );
      }
    } catch (error) {
      console.log(
        "Delete Complaint Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete complaint."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // STATUS BADGE
  // ========================================

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return `
        bg-green-100
        text-green-700
        dark:bg-green-900/40
        dark:text-green-300
      `;
    }

    if (status === "In Progress") {
      return `
        bg-yellow-100
        text-yellow-700
        dark:bg-yellow-900/40
        dark:text-yellow-300
      `;
    }

    return `
      bg-red-100
      text-red-700
      dark:bg-red-900/40
      dark:text-red-300
    `;
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <Navbar />

        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Loading your complaints...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

      {/* Navbar */}

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* =================================
            PAGE HEADER
        ================================== */}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Complaints
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and track your hostel
            complaints.
          </p>
        </div>

        {/* =================================
            ERROR
        ================================== */}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
            ⚠ {error}
          </div>
        )}

        {/* =================================
            EMPTY STATE
        ================================== */}

        {!error &&
        complaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              📭
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No Complaints Yet
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
              You haven't submitted any
              hostel complaints yet.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/complaint";
              }}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
                transition-colors
              "
            >
              Submit Your First Complaint
            </button>

          </div>
        ) : (
          /* =================================
             COMPLAINT CARDS
          ================================== */

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {complaints.map(
              (complaint) => (
                <div
                  key={complaint._id}
                  className="
                    bg-white
                    dark:bg-gray-900
                    border
                    border-gray-200
                    dark:border-gray-800
                    rounded-xl
                    shadow
                    hover:shadow-lg
                    transition-shadow
                    overflow-hidden
                  "
                >

                  {/* =========================
                      COMPLAINT IMAGE
                  ========================== */}

                  {complaint.image && (
                    <img
                      src={`${API_URL}${complaint.image}`}
                      alt="Complaint"
                      className="w-full h-52 object-cover"
                    />
                  )}

                  {/* =========================
                      COMPLAINT DETAILS
                  ========================== */}

                  <div className="p-5">

                    {/* Title + Status */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">

                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {complaint.title}
                      </h2>

                      <span
                        className={`
                          inline-block
                          whitespace-nowrap
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${getStatusClass(
                            complaint.status
                          )}
                        `}
                      >
                        {complaint.status}
                      </span>

                    </div>

                    {/* Category */}

                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Category
                      </p>

                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {complaint.category}
                      </p>
                    </div>

                    {/* Room Number */}

                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Room Number
                      </p>

                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {complaint.roomNumber}
                      </p>
                    </div>

                    {/* Description */}

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Description
                      </p>

                      <p className="text-gray-700 dark:text-gray-300 mt-1 break-words">
                        {complaint.description}
                      </p>
                    </div>

                    {/* Created Date */}

                    {complaint.createdAt && (
                      <div className="mb-4">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Submitted On
                        </p>

                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(
                            complaint.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>
                    )}

                    {/* =========================
                        STATUS INFORMATION
                    ========================== */}

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">

                      {complaint.status ===
                        "Pending" && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          ⏳ Your complaint is
                          waiting for admin
                          review.
                        </p>
                      )}

                      {complaint.status ===
                        "In Progress" && (
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          🔧 Your complaint is
                          currently being
                          handled.
                        </p>
                      )}

                      {complaint.status ===
                        "Resolved" && (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✓ This complaint has
                          been resolved.
                        </p>
                      )}

                    </div>

                    {/* =========================
                        DELETE BUTTON
                    ========================== */}

                    {complaint.status ===
                      "Pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteComplaint(
                            complaint._id
                          )
                        }
                        disabled={
                          deletingId ===
                          complaint._id
                        }
                        className="
                          w-full
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          px-4
                          py-2.5
                          rounded-lg
                          font-semibold
                          transition-colors
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >
                        {deletingId ===
                        complaint._id
                          ? "Deleting..."
                          : "Delete Complaint"}
                      </button>
                    )}

                  </div>
                </div>
              )
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default MyComplaints;