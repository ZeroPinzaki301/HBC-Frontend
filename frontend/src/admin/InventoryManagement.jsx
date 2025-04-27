import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router";

const AdminInventory = () => {
  const [products, setProducts] = useState([]); // Store product details
  const [error, setError] = useState(""); // Handle errors
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch product list on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products"); // Adjust this endpoint
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif">
    
      <Link
        to="/admin-dashboard"
        className="absolute top-4 left-4 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
      >
        Back to Dashboard
      </Link>
      
      <h1 className="text-center text-4xl font-bold mb-8">Inventory Management</h1>

      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center mb-4">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading inventory...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Product Name</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className={`${
                      product.stock < 5
                        ? "bg-red-100" // Red for stock < 5
                        : product.stock < 10
                        ? "bg-yellow-100" // Yellow for stock < 10
                        : ""
                    }`}
                  >
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">₱{product.price.toFixed(2)}</td>
                    <td className="border px-4 py-2">{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-center text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;