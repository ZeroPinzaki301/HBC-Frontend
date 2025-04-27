import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { io } from "socket.io-client";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const navigate = useNavigate();

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching order details.");
      }
    };

    fetchOrder();
  }, [orderId]);

  // Socket.IO for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("order-status-changed", (updatedOrder) => {
      console.log("Status update received:", updatedOrder.status); // Debug log

      if (updatedOrder._id === orderId) {
        // Update order state
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: updatedOrder.status,
          updatedAt: updatedOrder.updatedAt || new Date().toISOString(),
        }));

        // Handle status changes (case-insensitive checks)
        const status = updatedOrder.status.toLowerCase();

        if (status === "delivered") {
          console.log("Showing delivered prompt");
          setShowPrompt(true);
          setTimeout(() => navigate("/admin/manage-orders"), 10000);
        }

        if (status === "canceled" || status === "cancelled") {
          console.log("Showing cancellation prompt");
          setShowCancelPrompt(true);
          setTimeout(() => navigate("/admin/manage-orders"), 10000);
        }

        setShowMap(updatedOrder.status === "Out for Delivery");
      }
    });

    return () => socket.disconnect();
  }, [orderId, navigate]);

  // Update order status
  const updateOrderStatus = async (newStatus) => {
    setIsUpdating(true);

    try {
      await axiosInstance.put(`/orders/update-status/${orderId}`, {
        status: newStatus,
      });

      // Manual state update as fallback
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }));

      alert(`Order status updated to ${newStatus}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-serif relative">
      {/* Back button */}
      <Link
        to="/admin/manage-orders"
        className="absolute top-4 left-4 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
      >
        Back to Orders
      </Link>

      <h1 className="text-center text-3xl font-bold mb-8">Order Details</h1>

      {/* Error message */}
      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-4">
          {error}
        </p>
      )}

      {/* Order content */}
      {order ? (
        <div className={`bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto ${showPrompt || showCancelPrompt ? "opacity-50 pointer-events-none" : ""}`}>
          {/* Order details */}
          <h2 className="text-xl font-semibold mb-4">Order #{order._id}</h2>
          <p className="mb-4"><strong>User:</strong> {order.user?.name || "Unknown User"}</p>
          <p className="mb-4"><strong>Phone:</strong> {order.user?.phone || "N/A"}</p>
          <p className="mb-4"><strong>Manual Address:</strong> {order.manualAddress || "N/A"}</p>
          <p className="mb-4"><strong>Status:</strong> {order.status}</p>
          <p className="text-sm text-gray-500">
            Last Updated: {new Date(order.updatedAt).toLocaleString()}
          </p>
          <p className="mb-4"><strong>Delivery:</strong> {order.deliveryLocation?.coordinates?.join(", ") || "N/A"}</p>

          {/* Items table */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Items Ordered:</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Product</th>
                  <th className="border px-4 py-2 text-left">Quantity</th>
                  <th className="border px-4 py-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.product?._id}>
                    <td className="border px-4 py-2">{item.product?.name}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">₱{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status update buttons */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Update Status:</h3>
            <div className="space-y-2">
              <button
                onClick={() => updateOrderStatus("Preparing")}
                disabled={isUpdating}
                className={`w-full px-4 py-2 rounded-lg text-white ${
                  isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                Preparing
              </button>
              <button
                onClick={() => updateOrderStatus("Processing")}
                disabled={isUpdating}
                className={`w-full px-4 py-2 rounded-lg text-white ${
                  isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => updateOrderStatus("Out for Delivery")}
                disabled={isUpdating}
                className={`w-full px-4 py-2 rounded-lg text-white ${
                  isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Out for Delivery
              </button>
            </div>
          </div>

          {/* Map */}
          {showMap && order.deliveryLocation?.coordinates && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Customer Location:</h3>
              <iframe
                src={`https://www.google.com/maps?q=${order.deliveryLocation.coordinates[1]},${order.deliveryLocation.coordinates[0]}&z=15&output=embed`}
                width="100%"
                height="450"
                frameBorder="0"
                allowFullScreen=""
                title="Customer Location"
              ></iframe>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading order details...</p>
      )}

      {/* Delivered Success Prompt */}
      {showPrompt && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Delivered Successfully!</h2>
            <p className="text-gray-600 mb-6">You will be redirected in 10 seconds...</p>
            <button
              onClick={() => navigate("/admin/manage-orders")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Go to Manage Orders
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Prompt */}
      {showCancelPrompt && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Order Canceled!</h2>
            <p className="text-gray-600 mb-6">You will be redirected in 10 seconds...</p>
            <button
              onClick={() => navigate("/admin/manage-orders")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Go to Manage Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;