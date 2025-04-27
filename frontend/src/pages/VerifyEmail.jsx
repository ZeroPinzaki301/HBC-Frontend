import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve email from localStorage after registration
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("No email found. Please register again.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/verify", { email, verificationCode });
      setMessage(response.data.message);
      setError("");

      // Store JWT token and userId in localStorage (assuming backend sends token and user data)
      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id); // Add userId here
        localStorage.removeItem("email"); // Remove email after verification
        navigate("/account"); // Redirect to AccountPage
      } else {
        navigate("/login"); // Fallback to login if no token is received
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying email.");
      setMessage("");
    }
  };

  return (
    <div className="bg-zinc-200 min-h-screen flex items-center justify-center font-serif">
      <div className="max-w-lg w-full bg-zinc-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-zinc-100 text-center mb-8">Verify Your Email</h1>

        {message && <p className="text-green-500 text-center mb-4 font-medium">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

        {!error && (
          <form onSubmit={handleSubmit}>
            <p className="text-center text-zinc-300 mb-6">
              Verification code sent to <strong>{email}</strong>
            </p>
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block text-sm font-semibold text-zinc-300">
                Enter Verification Code
              </label>
              <input
                type="text"
                name="verificationCode"
                id="verificationCode"
                placeholder="Enter the code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="w-full px-4 py-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-zinc-700 text-zinc-100 py-3 rounded-lg hover:bg-zinc-600 transition-all shadow-md cursor-pointer"
            >
              Verify Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;