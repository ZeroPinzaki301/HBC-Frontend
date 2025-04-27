import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [variantData, setVariantData] = useState({});
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please log in.");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch cart from backend
        const { data } = await axiosInstance.get(`/cart/${userId}`);
        
        // Get variant info from localStorage
        const cartVariants = JSON.parse(localStorage.getItem('cartVariants') || []);
        const variantsMap = {};
        
        cartVariants.forEach(item => {
          if (!variantsMap[item.productId]) {
            variantsMap[item.productId] = [];
          }
          variantsMap[item.productId].push({
            variant: item.variant,
            price: item.price,
            quantity: item.quantity || 1
          });
        });
        
        setVariantData(variantsMap);
        setCart(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cart items.");
      }
    };

    fetchData();
  }, [userId]);

  const handleUpdateQuantity = async (productId, newQuantity, variant) => {
    try {
      // Update in localStorage
      const cartVariants = JSON.parse(localStorage.getItem('cartVariants') || []);
      const itemIndex = cartVariants.findIndex(
        item => item.productId === productId && item.variant === variant
      );
      
      if (itemIndex >= 0) {
        cartVariants[itemIndex].quantity = newQuantity;
        localStorage.setItem('cartVariants', JSON.stringify(cartVariants));
      }

      // Update in backend (using base product)
      await axiosInstance.put(`/cart/update/${userId}/${productId}`, { 
        quantity: newQuantity 
      });

      // Update UI
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      }));
    } catch (err) {
      setError("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (productId, variant) => {
    try {
      // Remove from localStorage
      let cartVariants = JSON.parse(localStorage.getItem('cartVariants') || []);
      cartVariants = cartVariants.filter(
        item => !(item.productId === productId && item.variant === variant)
      );
      localStorage.setItem('cartVariants', JSON.stringify(cartVariants));

      // Remove from backend
      await axiosInstance.delete(`/cart/remove/${userId}/${productId}`);

      // Update UI
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.product._id !== productId)
      }));
    } catch (err) {
      setError("Failed to remove item.");
    }
  };

  const calculateTotalPrice = () => {
    if (!cart) return 0;
    
    return cart.items.reduce((total, item) => {
      const variants = variantData[item.product._id] || [];
      const variantTotal = variants.reduce((sum, variant) => {
        return sum + (variant.price * (variant.quantity || 1));
      }, 0);
      
      return total + variantTotal;
    }, 0);
  };

  return (
    <div className="bg-zinc-100 min-h-screen p-4 sm:p-6 font-serif relative w-[95%] sm:w-[90%] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-zinc-700 hover:text-zinc-500 transition duration-200 font-medium cursor-pointer"
          onClick={() => window.history.back()}
        >
          <IoArrowBackCircleSharp className="text-4xl sm:text-5xl" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 text-center">Your Cart</h1>
      </div>

      {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>}

      {cart?.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {cart.items.flatMap(item => {
              const variants = variantData[item.product._id] || [{ variant: 'hot', price: item.product.price }];
              
              return variants.map((variantInfo, index) => (
                <div
                  key={`${item.product._id}-${variantInfo.variant}-${index}`}
                  className="bg-white border border-zinc-200 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={`${axiosInstance.defaults.baseURL.replace}('/api', '');${item.product.image}`}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-zinc-800">
                        {item.product.name} ({variantInfo.variant.toUpperCase()})
                      </h3>
                      <p className="text-zinc-600">₱{variantInfo.price} each</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="bg-zinc-200 px-3 py-1 rounded-l"
                        onClick={() => handleUpdateQuantity(
                          item.product._id, 
                          Math.max(1, (variantInfo.quantity || 1) - 1),
                          variantInfo.variant
                        )}
                      >
                        -
                      </button>
                      <span className="px-4">{variantInfo.quantity || 1}</span>
                      <button
                        className="bg-zinc-200 px-3 py-1 rounded-r"
                        onClick={() => handleUpdateQuantity(
                          item.product._id, 
                          (variantInfo.quantity || 1) + 1,
                          variantInfo.variant
                        )}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="bg-zinc-800 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleRemoveItem(item.product._id, variantInfo.variant)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 text-right font-medium">
                    Subtotal: ₱{(variantInfo.price * (variantInfo.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ));
            })}
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Total</h3>
              <p className="text-xl font-bold">₱{calculateTotalPrice().toFixed(2)}</p>
            </div>
            <button
              className="w-full bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700 transition"
              onClick={() => navigate(`/checkout/${userId}`)}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="text-zinc-500 text-center mt-8">Your cart is empty</p>
      )}
    </div>
  );
};

export default CartPage;
