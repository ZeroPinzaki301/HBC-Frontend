import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { io } from "socket.io-client"; // Import Socket.IO client

const OngoingOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const userId = localStorage.getItem("userId");

  // Fetch ongoing orders
  const fetchOngoingOrders = async () => {
    try {
      const response = await axiosInstance.get(`/orders/ongoing/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data.orders || []); // Safeguard for missing or invalid data
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching ongoing orders.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle real-time updates via Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:5000"); // Connect to the backend server

    // Listen for order status changes
    socket.on("order-status-changed", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
    });

    // Clean up socket connection on component unmount
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOngoingOrders();
    } else {
      setError("User ID not found. Please log in again.");
      setIsLoading(false);
    }
  }, [userId]);

  // Initiate cancellation
  const initiateCancel = (orderId) => {
    setCancelOrderId(orderId);
    setShowDialog(true);
  };

  // Confirm cancellation
  const confirmCancel = async () => {
    if (!cancelOrderId) return;
    setIsCancelling(true);
  
    try {
      const response = await axiosInstance.put(
        `/orders/cancel/${cancelOrderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      if (response.data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === cancelOrderId ? { ...order, status: "Canceled" } : order
          )
        );
        
        // Manually emit the event (if using Socket.IO on frontend)
        // Note: This is a fallback - the server should handle this!
        const socket = io("http://localhost:5000");
        socket.emit("order-status-changed", { 
          _id: cancelOrderId, 
          status: "Canceled" 
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error canceling the order. Please try again."
      );
    } finally {
      setIsCancelling(false);
      setShowDialog(false);
      setCancelOrderId(null);
    }
  };

  // Confirm delivery
  const confirmDelivery = async (orderId) => {
    try {
      const response = await axiosInstance.put(`/orders/update-status/${orderId}`, { status: "Delivered" }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Delivered" } : order
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error confirming delivery. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Ongoing Orders</h1>

        {isLoading && <p className="text-gray-500 text-center">Loading...</p>}

        {error && (
          <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-4 text-center">
            {error}
          </p>
        )}

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded-lg shadow-md">
                <div className="flex justify-between">
                  <p><strong>Order ID:</strong> {order._id.slice(-6)}</p>
                  <p className={`font-semibold ${
                    order.status === "Pending" ? "text-gray-600" :
                    order.status === "Preparing" ? "text-yellow-600" :
                    order.status === "Canceled" ? "text-red-600" :
                    order.status === "Processing" ? "text-blue-600" :
                    "text-green-600"
                  }`}>
                    {order.status}
                  </p>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border px-4 py-2 text-left">Product</th>
                        <th className="border px-4 py-2 text-left">Qty</th>
                        <th className="border px-4 py-2 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.product._id}>
                          <td className="border px-4 py-2">{item.product.name}</td>
                          <td className="border px-4 py-2">{item.quantity}</td>
                          <td className="border px-4 py-2">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cancel Button */}
                <button
                  onClick={() => initiateCancel(order._id)}
                  disabled={order.status !== "Pending" && order.status !== "Preparing" || isCancelling}
                  className={`mt-4 w-full py-2 rounded-lg transition duration-200 ${
                    order.status === "Pending" || order.status === "Preparing"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {order.status === "Pending" || order.status === "Preparing"
                    ? isCancelling && order._id === cancelOrderId
                      ? "Cancelling..."
                      : "Cancel Order"
                    : "Cancellation Not Available"}
                </button>

                {/* Delivered Button */}
                {order.status === "Out for Delivery" && (
                  <button
                    onClick={() => confirmDelivery(order._id)}
                    className={`mt-2 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200`}
                  >
                    Confirm Delivery
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-gray-500 text-center py-8">
              You have no ongoing orders.
            </p>
          )
        )}
      </div>

      {/* Confirmation Dialog */}
      {showDialog && (
        <ConfirmationDialog
          message="Are you sure you want to cancel this order?"
          onConfirm={confirmCancel}
          onCancel={() => {
            setShowDialog(false);
            setCancelOrderId(null);
          }}
          confirmText={isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
          cancelText="No, Keep It"
          confirmDisabled={isCancelling}
        />
      )}
    </div>
  );
};

export default OngoingOrdersPage;