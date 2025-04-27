import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import axiosInstance from "../utils/axiosInstance";
import { io } from "socket.io-client";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]); // Initialize orders as an empty array
  const [error, setError] = useState(""); // Capture errors
  const navigate = useNavigate(); // Enable navigation

  // Fetch Orders on Initial Render
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders");
        setOrders(data.orders || []); // Safeguard for missing or invalid data
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching orders.");
      }
    };

    fetchOrders();
  }, []);

  // Real-Time Updates for New Orders and Status Changes
  useEffect(() => {
    const socket = io("http://localhost:5000"); // Connect to the backend

    // Listen for "new-order" events
    socket.on("new-order", (order) => {
      setOrders((prevOrders) => [order, ...prevOrders]); // Add the new order to the top of the list
    });

    // Listen for "order-canceled" events
    socket.on("order-canceled", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, status: "Canceled" } : order
        )
      ); // Update the canceled order's status in the local state
    });

    // Listen for "order-delivered" events
    socket.on("order-delivered", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, status: "Delivered" } : order
        )
      ); // Update the delivered order's status in the local state
    });

    return () => socket.disconnect(); // Clean up socket connection on component unmount
  }, []);

  // Navigate to Order Details
  const openOrderDetails = (orderId) => {
    navigate(`/admin/manage-orders/${orderId}`); // Navigate to the specific order page
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif">
      {/* Back to Dashboard Link */}
      <Link
        to="/admin-dashboard"
        className="absolute top-4 left-4 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
      >
        Back to Dashboard
      </Link>

      <h1 className="text-center text-4xl font-bold mb-8">Manage Orders</h1>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-4">
          {error}
        </p>
      )}

      {/* Orders Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className={`bg-white p-4 rounded-lg shadow-md cursor-pointer ${
                order.status === "Canceled" || order.status === "Delivered"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
              onClick={() => {
                if (order.status !== "Canceled" && order.status !== "Delivered") openOrderDetails(order._id);
              }}
            >
              <h2 className="text-lg font-semibold mb-2">Order #{order._id}</h2>
              <p>User: {order.user?.name || "Unknown User"}</p>
              <p>Status: {order.status}</p>
              <p>
                Delivery:{" "}
                {order.deliveryLocation?.coordinates
                  ? order.deliveryLocation.coordinates.join(", ")
                  : "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No orders available to manage.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;