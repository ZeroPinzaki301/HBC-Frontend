import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    agreedToPolicy: false, // Field for agreement
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Update checkbox and text inputs
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/register", formData);
      setMessage(response.data.message);
      setError("");
      localStorage.setItem("email", formData.email);
      navigate("/verify-email");
    } catch (err) {
      setError(err.response?.data?.message || "Error registering user.");
      setMessage("");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-zinc-200 min-h-screen flex items-center justify-center font-serif">
      <div className="max-w-lg w-full bg-zinc-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-zinc-100 text-center mb-8">Create an Account</h1>

        {/* Success and Error Messages */}
        {message && <p className="text-green-500 text-center mb-4 font-medium">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition"
            />
          </div>
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
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-semibold text-zinc-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition"
            />
          </div>
          {/* Terms and Conditions Agreement */}
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="agreedToPolicy"
                checked={formData.agreedToPolicy}
                onChange={handleChange}
                required
              />
              <span className="text-sm text-zinc-300">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={openModal}
                  className="text-zinc-300 hover:underline focus:outline-none transition"
                >
                  Privacy Policy and Terms
                </button>
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-700 text-zinc-100 py-3 rounded-lg hover:bg-zinc-600 transition-all shadow-md cursor-pointer"
          >
            Register
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-zinc-300 hover:underline focus:outline-none transition cursor-pointer"
            >
              Login here
            </button>
          </p>
        </div>
      </div>

      {/* Modal for Privacy Policy and Terms */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 w-[90%] max-w-3xl p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b pb-4 mb-4 border-zinc-600">
              <h2 className="text-xl font-bold text-zinc-100">Privacy Policy & Terms</h2>
              <button
                onClick={closeModal}
                className="text-zinc-300 hover:text-zinc-100 transition duration-200 cursor-pointer"
              >
                ✖
              </button>
            </div>
            {/* Privacy Policy */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Privacy Policy</h3>
              <ol className="list-decimal pl-5 text-zinc-300">
                <li>Personal details (e.g., name, address, payment info) are collected.</li>
                <li>Information is used for order processing and service enhancements.</li>
                <li>Data is shared with trusted providers but not sold.</li>
                <li>Cookies improve user experience; users can disable them.</li>
                <li>Data is protected with encryption; no system is foolproof.</li>
                <li>Users can access, update, or delete personal data.</li>
              </ol>
            </div>
            {/* Terms and Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Terms and Conditions</h3>
              <ol className="list-decimal pl-5 text-zinc-300">
                <li>Orders are subject to availability and prepayment.</li>
                <li>Delivery times are approximate and require accurate customer information.</li>
                <li>Refunds are available for issues; some items are non-refundable.</li>
                <li>Fraudulent activities are prohibited.</li>
                <li>Content is protected under intellectual property laws.</li>
                <li>Liability excludes indirect or unforeseen damages.</li>
                <li>Policy updates are posted on the website.</li>
              </ol>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-zinc-700 text-zinc-100 py-2 px-4 rounded-lg hover:bg-zinc-600 transition duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;