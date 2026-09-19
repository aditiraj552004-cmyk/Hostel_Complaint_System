import { useState } from "react";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        {
          name,
          email,
          password,
        }
      );

      setMessage(response.data.message);

      if (response.data.success) {
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      }
    } catch (error) {
      console.log("Register Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to register."
      );
    }
  };

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
      <nav
        className="
          bg-blue-600
          dark:bg-gray-900
          text-white
          px-8
          py-4
          flex
          justify-between
          items-center
          shadow
        "
      >
        <h1 className="text-2xl font-bold">
          HostelCare
        </h1>

        <ThemeToggle />
      </nav>

      {/* Register Section */}
      <div className="flex items-center justify-center px-6 py-16">
        <div
          className="
            w-full
            max-w-md
            bg-white
            dark:bg-gray-900
            p-8
            rounded-xl
            shadow-lg
            border
            border-transparent
            dark:border-gray-800
          "
        >
          <h2
            className="
              text-3xl
              font-bold
              text-gray-800
              dark:text-white
              text-center
              mb-2
            "
          >
            Create Account
          </h2>

          <p
            className="
              text-gray-600
              dark:text-gray-400
              text-center
              mb-6
            "
          >
            Register to use HostelCare.
          </p>

          {message && (
            <div
              className="
                bg-blue-100
                dark:bg-blue-900/40
                text-blue-700
                dark:text-blue-300
                p-3
                rounded-lg
                mb-5
              "
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label
              className="
                block
                font-semibold
                text-gray-700
                dark:text-gray-300
                mb-2
              "
            >
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
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
              "
              required
            />

            <label
              className="
                block
                font-semibold
                text-gray-700
                dark:text-gray-300
                mb-2
              "
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              "
              required
            />

            <label
              className="
                block
                font-semibold
                text-gray-700
                dark:text-gray-300
                mb-2
              "
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                p-3
                rounded-lg
                mb-6
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />

            <button
              type="submit"
              className="
                w-full
                bg-blue-600
                text-white
                py-3
                rounded-lg
                font-semibold
                hover:bg-blue-700
                transition-colors
              "
            >
              Register
            </button>
          </form>

          <p
            className="
              text-center
              text-gray-600
              dark:text-gray-400
              mt-6
            "
          >
            Already have an account?{" "}
            <a
              href="/login"
              className="
                text-blue-600
                dark:text-blue-400
                font-semibold
                hover:underline
              "
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;