import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { IoCartSharp } from "react-icons/io5";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const beverageTypes = [
    "espresso based",
    "coffee based frappe",
    "non-coffee based",
    "non-coffee based frappe",
    "refreshments",
    "cold brew specials",
  ];

  const groupedBeverageProducts = beverageTypes.map((type) => ({
    type,
    products: products.filter(
      (product) => product.productType === "beverages" && product.beverageType === type
    ),
  }));

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 font-serif w-full mx-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl font-bold mb-6 md:mb-8">
          HYPEBEANS <span className="font-medium">Products</span>
        </h1>

        {error && (
          <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-end mb-6">
          <select
            className="p-2 border rounded-lg w-full md:w-1/4 text-sm md:text-base"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="beverages">Beverages</option>
            <option value="delights">Delights</option>
          </select>
        </div>

        {filterType === "all" && (
          <>
            {groupedBeverageProducts.map((group) => (
              <div key={group.type} className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 capitalize">
                  {group.type}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                  {group.products.map((product) => (
                    <Link to={`/products/${product._id}`} key={product._id}>
                      <div className="bg-zinc-800 p-4 md:py-7 rounded-lg shadow-md">
                        <img
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.name}
                          className="h-auto aspect-square object-cover mx-auto rounded-full mb-4 w-[70%] md:w-[60%]"
                        />
                        <h3 className="text-lg md:text-xl text-white text-center tracking-widest font-semibold">
                          {product.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Delights</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                {products
                  .filter((product) => product.productType === "delights")
                  .map((product) => (
                    <Link to={`/products/${product._id}`} key={product._id}>
                      <div className="bg-zinc-800 p-4 md:py-7 rounded-lg shadow-md">
                        <img
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.name}
                          className="h-auto aspect-square object-cover mx-auto rounded-full mb-4 w-[70%] md:w-[60%]"
                        />
                        <h3 className="text-lg md:text-xl text-white text-center tracking-widest font-semibold">
                          {product.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </>
        )}

        {filterType === "beverages" &&
          groupedBeverageProducts.map((group) => (
            <div key={group.type} className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 capitalize">
                {group.type}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                {group.products.map((product) => (
                  <Link to={`/products/${product._id}`} key={product._id}>
                    <div className="bg-zinc-800 p-4 md:py-7 rounded-lg shadow-md">
                      <img
                        src={`http://localhost:5000/${product.image}`}
                        alt={product.name}
                        className="h-auto aspect-square object-cover mx-auto rounded-full mb-4 w-[70%] md:w-[60%]"
                      />
                      <h3 className="text-lg md:text-xl text-white text-center tracking-widest font-semibold">
                        {product.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

        {filterType === "delights" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
            {products
              .filter((product) => product.productType === "delights")
              .map((product) => (
                <div key={product._id} className="bg-white p-4 md:py-7 rounded-lg shadow-md">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                    className="h-auto aspect-square object-cover mx-auto rounded-full mb-4 w-[70%] md:w-[60%]"
                  />
                  <h3 className="text-base md:text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-700">₱{product.price}</p>
                  <Link
                    to={`/products/${product._id}`}
                    className="mt-2 md:mt-4 text-blue-600 hover:underline text-sm md:text-base"
                  >
                    View Details
                  </Link>
                </div>
              ))}
          </div>
        )}

        <div className="flex fixed bottom-4 right-4 gap-4 md:gap-6">
          {isLoggedIn && (
            <Link to="/cart" className="bg-zinc-800 text-white p-3 rounded-md">
              <IoCartSharp className="text-xl md:text-2xl" />
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/orders/ongoing" className="bg-zinc-800 text-white p-2 md:p-3 rounded-md text-sm md:text-base">
              Ongoing
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;