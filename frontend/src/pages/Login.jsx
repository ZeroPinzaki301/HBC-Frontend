import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/login", formData); // Backend login route

      setMessage(response.data.message);
      setError("");

      // Save token and userId to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);

      if (response.data.user.isAdmin) {
        // Save email for admin verification flow
        localStorage.setItem("email", response.data.user.email);
        navigate("/admin-verify"); // Redirect to admin verification page
      } else {
        navigate("/account"); // Redirect regular users to AccountPage
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in.");
      setMessage("");
    }
  };

  return (
    <div className="bg-zinc-200 min-h-screen flex items-center justify-center font-serif">
      <div className="max-w-lg w-full bg-zinc-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-zinc-100 text-center mb-8">Login to HYPEBEANS</h1>

        {/* Success and Error Messages */}
        {message && <p className="text-green-500 text-center mb-4 font-medium">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-zinc-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-700 text-zinc-100 py-3 rounded-lg hover:bg-zinc-600 transition-all shadow-md cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-zinc-300 hover:underline focus:outline-none transition cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;