import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Get the userId from localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/orders/history/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching order history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userId]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Order History</h1>

        {isLoading && <p className="text-gray-500 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded-lg shadow-md">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                {/* Add Date and Time under Status */}
                <p className="text-sm text-gray-500">
                  Last Updated: {new Date(order.updatedAt).toLocaleString()}
                </p>
                <div className="mt-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border px-4 py-2 text-left">Product Name</th>
                        <th className="border px-4 py-2 text-left">Quantity</th>
                        <th className="border px-4 py-2 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.product._id}>
                          <td className="border px-4 py-2">{item.product.name}</td>
                          <td className="border px-4 py-2">{item.quantity}</td>
                          <td className="border px-4 py-2">₱{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-gray-500 text-center">You have no past orders.</p>
          )
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;