import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import API_URL from "../config/api";

function Register() {
  const navigate = useNavigate();

  // ========================================
  // STATES
  // ========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);

  // ========================================
  // REGISTER
  // ========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setMessage("");
    setMessageType("");

    // ----------------------------------------
    // Frontend validation
    // ----------------------------------------

    if (!name.trim()) {
      setMessage("Please enter your name.");
      setMessageType("error");
      return;
    }

    if (name.trim().length < 2) {
      setMessage(
        "Name must contain at least 2 characters."
      );
      setMessageType("error");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email.");
      setMessageType("error");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setMessage(
        "Please enter a valid email address."
      );
      setMessageType("error");
      return;
    }

    if (!password) {
      setMessage("Please enter a password.");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must contain at least 6 characters."
      );
      setMessageType("error");
      return;
    }

    // ----------------------------------------
    // Send registration request
    // ----------------------------------------

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }
      );

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Registration successful!"
        );

        setMessageType("success");

        // Clear form
        setName("");
        setEmail("");
        setPassword("");

        // Redirect to login after success
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      console.log(
        "Register Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to register."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

      {/* =====================================
          TOP NAVBAR
      ====================================== */}

      <nav className="bg-blue-600 dark:bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          <h1 className="text-xl sm:text-2xl font-bold">
            HostelCare
          </h1>

          <ThemeToggle />

        </div>
      </nav>

      {/* =====================================
          REGISTER SECTION
      ====================================== */}

      <main className="flex items-center justify-center px-4 sm:px-6 py-12">

        <div
          className="
            w-full
            max-w-md
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-xl
            shadow-lg
            p-6
            sm:p-8
          "
        >

          {/* Header */}

          <div className="text-center mb-6">

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Register to use HostelCare.
            </p>

          </div>

          {/* =================================
              MESSAGE
          ================================== */}

          {message && (
            <div
              className={`
                mb-5
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium

                ${
                  messageType === "success"
                    ? `
                      bg-green-100
                      text-green-700
                      dark:bg-green-900/40
                      dark:text-green-300
                    `
                    : `
                      bg-red-100
                      text-red-700
                      dark:bg-red-900/40
                      dark:text-red-300
                    `
                }
              `}
            >
              {messageType === "success"
                ? "✓ "
                : "⚠ "}
              {message}
            </div>
          )}

          {/* =================================
              REGISTER FORM
          ================================== */}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                disabled={loading}
                onChange={(e) =>
                  setName(e.target.value)
                }
                minLength={2}
                maxLength={50}
                required
                autoComplete="name"
                className="
                  w-full
                  border
                  border-gray-300
                  dark:border-gray-700
                  rounded-lg
                  px-4
                  py-3
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

            </div>

            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled={loading}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                className="
                  w-full
                  border
                  border-gray-300
                  dark:border-gray-700
                  rounded-lg
                  px-4
                  py-3
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

            </div>

            {/* Password */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                disabled={loading}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                minLength={6}
                required
                autoComplete="new-password"
                className="
                  w-full
                  border
                  border-gray-300
                  dark:border-gray-700
                  rounded-lg
                  px-4
                  py-3
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

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Password must contain at least
                6 characters.
              </p>

            </div>

            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                py-3
                rounded-lg
                transition-colors
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>

          </form>

          {/* =================================
              LOGIN LINK
          ================================== */}

          <div className="text-center mt-6">

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}

              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Register;