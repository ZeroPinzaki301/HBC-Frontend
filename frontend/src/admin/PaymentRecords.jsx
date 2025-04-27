import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router";

const AdminPaymentProofs = () => {
  const [paymentProofs, setPaymentProofs] = useState([]); // Store payment proofs
  const [error, setError] = useState(""); // Handle errors
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch all payment proofs on page load
  useEffect(() => {
    const fetchPaymentProofs = async () => {
      try {
        const { data } = await axiosInstance.get("/payment-proof/all");
        setPaymentProofs(data); // Set payment proofs in state
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching payment proofs.");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchPaymentProofs();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif">
      <Link
        to="/admin-dashboard"
        className="absolute top-4 left-4 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
      >
        Back to Dashboard
      </Link>
      <h1 className="text-center text-4xl font-bold mb-8">Payment Proofs</h1>

      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-4 text-center">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-center text-gray-500">Loading payment proofs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentProofs.length > 0 ? (
            paymentProofs.map((proof) => (
              <div
                key={proof._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold mb-4">Proof ID: {proof._id}</h2>
                <p>
                  <strong>User:</strong> {proof.userId?.name || "Unknown User"}
                </p>
                <p>
                  <strong>Email:</strong> {proof.userId?.email || "N/A"}
                </p>
                <p>
                  <strong>GCash Number:</strong> {proof.gcashNumber}
                </p>
                <p>
                  <strong>Uploaded At:</strong>{" "}
                  {new Date(proof.createdAt).toLocaleString()}
                </p>
                <div className="mt-4">
                  <p>
                    <strong>Proof Image:</strong>
                  </p>
                  <a
                    href={`${axiosInstance.defaults.baseURL.replace('/api', '')}/${proof.proofImage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Proof
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No payment proofs available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentProofs;
