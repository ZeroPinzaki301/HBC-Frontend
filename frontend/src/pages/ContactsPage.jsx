import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/messages/contact", formData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error submitting message. Please try again later."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="bg-zinc-200 min-h-screen p-8 font-serif text-zinc-100">
      <h1 className="text-center text-5xl font-extrabold text-zinc-800 mb-10">Contact Us</h1>

      {successMessage && <p className="text-green-500 text-center mb-6 font-medium">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-center mb-6 font-medium">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-zinc-800 p-8 rounded-xl shadow-lg">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-semibold text-zinc-300">
            Name
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
            Email
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
          <label htmlFor="subject" className="block text-sm font-semibold text-zinc-300">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-semibold text-zinc-300">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-zinc-700 text-zinc-100 py-3 rounded-lg hover:bg-zinc-600 transition-all shadow-md cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactsPage;