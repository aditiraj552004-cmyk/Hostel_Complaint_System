import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_URL from "../config/api";

function AdminDashboard() {
  // ========================================
  // STATES
  // ========================================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("");

  // Day 29 - prevent multiple status updates
  const [updatingId, setUpdatingId] =
    useState(null);

  const token = localStorage.getItem("token");

  // ========================================
  // FETCH ALL COMPLAINTS
  // ========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        `${API_URL}/admin/complaints`,
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
        "Admin Complaint Fetch Error:",
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
  // UPDATE COMPLAINT STATUS
  // ========================================

  const updateStatus = async (
    complaintId,
    newStatus
  ) => {
    // Prevent duplicate request
    if (updatingId === complaintId) {
      return;
    }

    try {
      setUpdatingId(complaintId);

      const currentToken =
        localStorage.getItem("token");

      if (!currentToken) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.put(
        `${API_URL}/admin/complaints/${complaintId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (response.data.success) {
        // Update complaint locally.
        // This also automatically updates
        // statistics and analytics.
        setComplaints(
          (previousComplaints) =>
            previousComplaints.map(
              (complaint) =>
                complaint._id === complaintId
                  ? {
                      ...complaint,
                      status: newStatus,
                    }
                  : complaint
            )
        );
      }
    } catch (error) {
      console.log(
        "Status Update Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update complaint status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ========================================
  // DAY 24 - DASHBOARD STATISTICS
  // ========================================

  const totalComplaints = complaints.length;

  const pendingComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Pending"
    ).length;

  const inProgressComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "In Progress"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Resolved"
    ).length;

  // ========================================
  // DAY 25 - RESOLUTION RATE
  // ========================================

  const resolutionRate =
    totalComplaints === 0
      ? 0
      : Math.round(
          (resolvedComplaints /
            totalComplaints) *
            100
        );

  // ========================================
  // DAY 25 - CATEGORY ANALYTICS
  // ========================================

  const categories = [
    "Electrical",
    "Plumbing",
    "Cleaning",
    "Food",
    "Internet",
    "Other",
  ];

  const categoryStats = categories.map(
    (category) => ({
      category,
      count: complaints.filter(
        (complaint) =>
          complaint.category === category
      ).length,
    })
  );

  // ========================================
  // DAY 19 - SEARCH + FILTER
  // ========================================

  const filteredComplaints =
    complaints.filter((complaint) => {
      const searchValue =
        search.toLowerCase().trim();

      const title =
        complaint.title?.toLowerCase() || "";

      const description =
        complaint.description?.toLowerCase() ||
        "";

      const room =
        complaint.roomNumber
          ?.toString()
          .toLowerCase() || "";

      const studentName =
        complaint.userId?.name
          ?.toLowerCase() || "";

      const studentEmail =
        complaint.userId?.email
          ?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        room.includes(searchValue) ||
        studentName.includes(searchValue) ||
        studentEmail.includes(searchValue);

      const matchesStatus =
        !statusFilter ||
        complaint.status === statusFilter;

      const matchesCategory =
        !categoryFilter ||
        complaint.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
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
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <Navbar />

        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="text-4xl mb-4">
              ⏳
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Loading admin dashboard...
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

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* =================================
            HEADER
        ================================== */}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and monitor hostel
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
            DAY 24 - STATISTICS
        ================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total */}

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Complaints
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalComplaints}
            </h2>
          </div>

          {/* Pending */}

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {pendingComplaints}
            </h2>
          </div>

          {/* In Progress */}

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              In Progress
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {inProgressComplaints}
            </h2>
          </div>

          {/* Resolved */}

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Resolved
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {resolvedComplaints}
            </h2>
          </div>
        </div>

        {/* =================================
            DAY 25 - ANALYTICS
        ================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Resolution Rate */}

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Resolution Rate
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Percentage of complaints
                  resolved.
                </p>
              </div>

              <span className="text-2xl font-bold text-green-600">
                {resolutionRate}%
              </span>
            </div>

            {/* Progress Bar */}

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${resolutionRate}%`,
                }}
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              {resolvedComplaints} of{" "}
              {totalComplaints} complaints
              resolved
            </p>
          </div>

          {/* Category Distribution */}

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Category Distribution
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Complaints grouped by category.
            </p>

            <div className="space-y-3">
              {categoryStats.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.category}
                  </span>

                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* =================================
            SEARCH + FILTERS
        ================================== */}

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-5 mb-8">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}

            <input
              type="text"
              placeholder="Search title, room, student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                flex-1
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                px-4 py-3
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

            {/* Status Filter */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                px-4 py-3
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
              "
            >
              <option value="">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>

            {/* Category Filter */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              className="
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                px-4 py-3
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
              "
            >
              <option value="">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            {/* Clear */}

            <button
              type="button"
              onClick={clearFilters}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear Filters
            </button>

          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Showing{" "}
            <span className="font-semibold">
              {filteredComplaints.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {complaints.length}
            </span>{" "}
            complaints
          </p>

        </div>

        {/* =================================
            NO SEARCH RESULTS
        ================================== */}

        {!error &&
        filteredComplaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No Complaints Found
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
              {complaints.length === 0
                ? "No complaints have been submitted yet."
                : "Try changing your search or filters."}
            </p>

            {complaints.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Filters
              </button>
            )}

          </div>
        ) : (
          /* =================================
             COMPLAINT CARDS
          ================================== */

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {filteredComplaints.map(
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

                  {/* Complaint Image */}

                  {complaint.image && (
                    <img
                      src={`${API_URL}${complaint.image}`}
                      alt="Complaint"
                      className="w-full h-56 object-cover"
                    />
                  )}

                  <div className="p-5">

                    {/* Title + Badge */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">

                      <h2 className="text-xl font-bold text-gray-900 dark:text-white break-words">
                        {complaint.title}
                      </h2>

                      <span
                        className={`
                          inline-block
                          whitespace-nowrap
                          px-3 py-1
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

                    {/* Student */}

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Student
                      </p>

                      <p className="font-semibold text-gray-900 dark:text-white">
                        {complaint.userId
                          ?.name ||
                          "Unknown Student"}
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                        {complaint.userId
                          ?.email ||
                          "Email unavailable"}
                      </p>

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

                    {/* Room */}

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

                    {/* Date */}

                    {complaint.createdAt && (
                      <div className="mb-5">
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

                    {/* =================================
                        DAY 29 - STATUS UPDATE
                    ================================== */}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">

                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Update Status
                      </label>

                      <select
                        value={
                          complaint.status
                        }
                        onChange={(e) =>
                          updateStatus(
                            complaint._id,
                            e.target.value
                          )
                        }
                        disabled={
                          updatingId ===
                          complaint._id
                        }
                        className="
                          w-full
                          border
                          border-gray-300
                          dark:border-gray-700
                          rounded-lg
                          px-3 py-2.5
                          bg-white
                          dark:bg-gray-800
                          text-gray-900
                          dark:text-white
                          focus:outline-none
                          focus:ring-2
                          focus:ring-blue-500
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>
                      </select>

                      {/* Updating Message */}

                      {updatingId ===
                        complaint._id && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-blue-600 dark:text-blue-400">
                          <span>
                            ⏳
                          </span>

                          <span>
                            Updating
                            status...
                          </span>
                        </div>
                      )}

                    </div>

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

export default AdminDashboard;