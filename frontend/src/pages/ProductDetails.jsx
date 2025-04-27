import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { IoCartSharp, IoArrowBackCircleSharp } from "react-icons/io5";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product details.");
      }
    };

    fetchProductDetails();
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [id]);

  const handleAddToCart = async (type) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const price = type === "iced" ? product.price + 10 : product.price;
      
      // Store variant info in localStorage
      const cartVariants = JSON.parse(localStorage.getItem('cartVariants') || '[]');
      const existingIndex = cartVariants.findIndex(
        item => item.productId === product._id && item.variant === type
      );

      if (existingIndex >= 0) {
        // Update existing variant
        cartVariants[existingIndex].price = price;
        cartVariants[existingIndex].quantity = (cartVariants[existingIndex].quantity || 1) + 1;
      } else {
        // Add new variant
        cartVariants.push({
          productId: product._id,
          variant: type,
          price,
          quantity: 1
        });
      }

      localStorage.setItem('cartVariants', JSON.stringify(cartVariants));

      // Send to backend (using original product ID)
      await axiosInstance.post("/cart/add", {
        userId,
        productId: product._id,
        quantity: 1,
        price: product.price // Base price
      });

      alert(`Added ${type} ${product.name} to cart for ₱${price}`);
    } catch (error) {
      console.error("Add to Cart Error:", error);
      alert("Failed to add item to cart.");
    }
  };

  const handleBuy = (type) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const price = type === "iced" ? product.price + 10 : product.price;
    alert(`Buying ${type} ${product.name} for ₱${price}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif relative w-[90%] mx-auto">
      {error ? (
        <p className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>
      ) : product ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              className="text-zinc-800 hover:text-zinc-600 transition duration-200 font-medium cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <IoArrowBackCircleSharp className="text-6xl" />
            </button>
            <h1 className="text-3xl font-bold text-center">{product.name}</h1>
            <button
              className="bg-zinc-800 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-zinc-600 transition duration-200 cursor-pointer"
              onClick={() => (isLoggedIn ? navigate("/cart") : navigate("/login"))}
            >
              <IoCartSharp className="text-2xl" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hot */}
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold tracking-widest mb-2">HOT</h2>
              <div className="w-[70%] bg-zinc-800 py-5 mx-auto rounded-xl mb-5">
                <img
                  src={`${axiosInstance.defaults.baseURL.replace('/api', '')}/${product.image}`}
                  alt={`${product.name} - Hot`}
                  className="h-auto aspect-square object-cover mx-auto rounded-4xl w-[50%] mb-6 cursor-pointer"
                />
                <div className="text-xl bg-gray-200 font-bold mb-4 w-[65%] mx-auto py-5 rounded-lg flex justify-between px-7">
                  <p className="font-light tracking-widest">
                    <span className="font-bold text-3xl">10</span>oz
                  </p>
                  <div className="bg-zinc-800 text-white px-5 py-2 rounded-md">
                    ₱{product.price}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6">
                <button
                  className="bg-zinc-800 text-white py-2 px-4 rounded-sm hover:bg-zinc-600 transition duration-200 cursor-pointer"
                  onClick={() => handleBuy("hot")}
                >
                  BUY
                </button>
                <button
                  className="bg-white text-black border-2 py-2 px-4 rounded-sm hover:bg-gray-300 transition duration-200 cursor-pointer"
                  onClick={() => handleAddToCart("hot")}
                >
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* Iced */}
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold tracking-widest mb-2">ICED</h2>
              <div className="w-[70%] bg-zinc-800 py-5 mx-auto rounded-xl mb-5">
                <img
                  src={`${axiosInstance.defaults.baseURL.replace('/api', '')}/${product.image}`}
                  alt={`${product.name} - Iced`}
                  className="h-auto aspect-square object-cover mx-auto rounded-4xl w-[50%] mb-6 cursor-pointer"
                />
                <div className="text-xl bg-gray-200 font-bold mb-4 w-[65%] mx-auto py-5 rounded-lg flex justify-between px-7">
                  <p className="font-light tracking-widest">
                    <span className="font-bold text-3xl">16</span>oz
                  </p>
                  <div className="bg-zinc-800 text-white px-5 py-2 rounded-md">
                    ₱{product.price + 10}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6">
                <button
                  className="bg-zinc-800 text-white py-2 px-4 rounded-sm hover:bg-zinc-600 transition duration-200 cursor-pointer"
                  onClick={() => handleBuy("iced")}
                >
                  BUY
                </button>
                <button
                  className="bg-white text-black border-2 py-2 px-4 rounded-sm hover:bg-gray-300 transition duration-200 cursor-pointer"
                  onClick={() => handleAddToCart("iced")}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetails;
