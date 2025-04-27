import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router";


const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosInstance.get("/messages/messages");
        setMessages(data);
      } catch (err) {
        setError("Failed to fetch messages. Please try again later.");
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif">
      <Link
        to="/admin-dashboard"
        className="absolute top-4 left-4 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
      >
        Back to Dashboard
      </Link>

      <h1 className="text-center text-4xl font-bold mb-8">Messages</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages found.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li key={message._id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">{message.subject}</h3>
                <p className="text-gray-700">{message.message}</p>
                <p className="text-gray-500 text-sm">
                  From: {message.name} ({message.email})
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;