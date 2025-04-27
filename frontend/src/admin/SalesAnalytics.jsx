import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [mostSoldWeek, setMostSoldWeek] = useState(null);
  const [mostSoldMonth, setMostSoldMonth] = useState(null);
  const [mostSoldAllTime, setMostSoldAllTime] = useState(null);
  const [productsSalesSummary, setProductsSalesSummary] = useState([]); // List of all products and their total sold

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/sales-summary");

        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        const months = Array.from({ length: 12 }, (_, index) => ({
          month: monthNames[index],
          totalSales: 0,
        }));

        data.forEach((sale) => {
          const monthIndex = sale.month - 1;
          months[monthIndex].totalSales = sale.totalSales;
        });

        setSalesData(months);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data.message || "Error fetching sales data.");
        setIsLoading(false);
      }
    };

    const fetchMostSoldProducts = async () => {
      try {
        const weekData = await axiosInstance.get("/admin/most-sold/week");
        const monthData = await axiosInstance.get("/admin/most-sold/month");
        const allTimeData = await axiosInstance.get("/admin/most-sold/all-time");

        setMostSoldWeek(weekData.data.product);
        setMostSoldMonth(monthData.data.product);
        setMostSoldAllTime(allTimeData.data.product);
      } catch (err) {
        console.error("Error fetching most sold products:", err.response?.data.message || err.message);
      }
    };

    const fetchProductsSalesSummary = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/products-sales-summary");
        setProductsSalesSummary(data.products);
      } catch (err) {
        console.error("Error fetching products sales summary:", err.response?.data.message || err.message);
      }
    };

    fetchSalesData();
    fetchMostSoldProducts();
    fetchProductsSalesSummary();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif">
      <Link
        to="/admin-dashboard"
        className="absolute top-4 left-4 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
      >
        Back to Dashboard
      </Link>

      <h1 className="text-center text-4xl font-bold mb-8">Sales Analytics</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">Loading sales data...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Most Sold (Week)</h2>
              {mostSoldWeek ? (
                <>
                  <img
                    src={mostSoldWeek.image}
                    alt={mostSoldWeek.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-md"
                  />
                  <p className="text-lg">{mostSoldWeek.name}</p>
                  <p className="text-gray-500">{mostSoldWeek.quantity} sold</p>
                </>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Most Sold (Month)</h2>
              {mostSoldMonth ? (
                <>
                  <img
                    src={mostSoldMonth.image}
                    alt={mostSoldMonth.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-md"
                  />
                  <p className="text-lg">{mostSoldMonth.name}</p>
                  <p className="text-gray-500">{mostSoldMonth.quantity} sold</p>
                </>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Most Sold (All Time)</h2>
              {mostSoldAllTime ? (
                <>
                  <img
                    src={mostSoldAllTime.image}
                    alt={mostSoldAllTime.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-md"
                  />
                  <p className="text-lg">{mostSoldAllTime.name}</p>
                  <p className="text-gray-500">{mostSoldAllTime.quantity} sold</p>
                </>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          </div>

          {/* List of All Products */}
          <div className="mt-12 w-full">
            <h2 className="text-center text-2xl font-bold mb-4">All Products and Numbers Sold</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Product</th>
                    <th className="border border-gray-300 px-4 py-2">Image</th>
                    <th className="border border-gray-300 px-4 py-2">Total Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {productsSalesSummary.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{product.totalSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesAnalytics;