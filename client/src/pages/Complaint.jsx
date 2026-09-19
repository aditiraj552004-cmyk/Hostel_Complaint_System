import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_URL from "../config/api";

function Complaint() {
  // ========================================
  // STATES
  // ========================================

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // ========================================
  // IMAGE VALIDATION
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // No file selected
    if (!file) {
      setImage(null);
      return;
    }

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    // Check image type
    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    // Maximum image size = 5 MB
    const maxSize = 5 * 1024 * 1024;

    // Check image size
    if (file.size > maxSize) {
      alert(
        "Image size cannot exceed 5 MB."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    // Valid image
    setImage(file);
  };

  // ========================================
  // SUBMIT COMPLAINT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submission
    if (submitting) {
      return;
    }

    setSubmitting(true);

    // Remove previous message
    setMessage("");
    setMessageType("");

    try {
      // Get JWT token
      const token =
        localStorage.getItem("token");

      // User not logged in
      if (!token) {
        window.location.href = "/login";
        return;
      }

      // ====================================
      // Create FormData
      // ====================================

      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "roomNumber",
        roomNumber.trim()
      );

      // Image is optional
      if (image) {
        formData.append(
          "image",
          image
        );
      }

      // ====================================
      // Send Complaint to Backend
      // ====================================

      const response = await axios.post(
        `${API_URL}/complaints`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ====================================
      // Success
      // ====================================

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Complaint submitted successfully."
        );

        setMessageType("success");

        // Clear form
        setTitle("");
        setCategory("");
        setDescription("");
        setRoomNumber("");
        setImage(null);
      }
    } catch (error) {
      console.log(
        "Complaint Error:",
        error
      );

      // ====================================
      // Error
      // ====================================

      setMessage(
        error.response?.data?.message ||
          "Unable to submit complaint."
      );

      setMessageType("error");
    } finally {
      // Enable submit button again
      setSubmitting(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

      {/* ===================================
          NAVBAR
      ==================================== */}

      <Navbar />

      {/* ===================================
          FORM SECTION
      ==================================== */}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-5 sm:p-8 rounded-xl shadow-lg border border-transparent dark:border-gray-800">

          {/* Heading */}

          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Submit Complaint
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tell us about the problem in your hostel.
          </p>

          {/* =================================
              SUCCESS / ERROR MESSAGE
          ================================== */}

          {message && (
            <div
              className={`p-3 rounded-lg mb-5 ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}
            >
              {messageType === "success"
                ? "✓ "
                : "⚠ "}

              {message}
            </div>
          )}

          {/* =================================
              COMPLAINT FORM
          ================================== */}

          <form onSubmit={handleSubmit}>

            {/* =================================
                COMPLAINT TITLE
            ================================== */}

            <label className="block font-semibold mb-2">
              Complaint Title
            </label>

            <input
              type="text"
              placeholder="Enter complaint title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              minLength={3}
              maxLength={100}
              required
              disabled={submitting}
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                p-3
                rounded-lg
                mb-5
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />

            {/* =================================
                CATEGORY
            ================================== */}

            <label className="block font-semibold mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
              disabled={submitting}
              className="
                w-full
                p-3
                mb-5
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              <option value="">
                Select Category
              </option>

              <option value="Electrical">
                Electrical
              </option>

              <option value="Plumbing">
                Plumbing
              </option>

              <option value="Cleaning">
                Cleaning
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Internet">
                Internet
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* =================================
                ROOM NUMBER
            ================================== */}

            <label className="block font-semibold mb-2">
              Room Number
            </label>

            <input
              type="text"
              placeholder="Enter room number"
              value={roomNumber}
              onChange={(e) =>
                setRoomNumber(
                  e.target.value
                )
              }
              maxLength={20}
              required
              disabled={submitting}
              className="
                w-full
                p-3
                mb-5
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />

            {/* =================================
                DESCRIPTION
            ================================== */}

            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              placeholder="Describe your problem..."
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              minLength={10}
              maxLength={1000}
              required
              disabled={submitting}
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                p-3
                rounded-lg
                mb-2
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />

            {/* Character Counter */}

            <div className="flex justify-end mb-5">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description.length}/1000
              </p>
            </div>

            {/* =================================
                COMPLAINT IMAGE
            ================================== */}

            <label className="block font-semibold mb-2">
              Complaint Image
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {" "}
                (Optional)
              </span>
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={submitting}
              className="
                w-full
                p-3
                mb-2
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />

            {/* Image Requirements */}

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Allowed: JPG, PNG, WEBP • Maximum size: 5 MB
            </p>

            {/* =================================
                SELECTED IMAGE INFORMATION
            ================================== */}

            {image && (
              <div className="mb-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">

                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  ✓ Selected image:{" "}
                  {image.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Size:{" "}
                  {(
                    image.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>

              </div>
            )}

            {/* =================================
                SUBMIT BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={submitting}
              className="
                w-full
                bg-blue-600
                text-white
                py-3
                rounded-lg
                font-semibold
                hover:bg-blue-700
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {submitting
                ? "Submitting..."
                : "Submit Complaint"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}

export default Complaint;