// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { useNavigate, useParams } from "react-router-dom";

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const { userId } = useParams(); // Get userId from URL
//   const [cart, setCart] = useState([]);
//   const [gpsLocation, setGpsLocation] = useState(null); // GPS location (GeoJSON format)
//   const [manualAddress, setManualAddress] = useState(""); // Optional manual address
//   const [paymentMethod, setPaymentMethod] = useState("GCash");
//   const [gcashNumber, setGcashNumber] = useState(""); // For refund in case of issues
//   const [proofImage, setProofImage] = useState(null); // Uploaded proof of payment
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState("");

//   const totalPrice = cart.reduce((accumulator, item) => {
//     return accumulator + item.price * item.quantity;
//   }, 0);

//   const deliveryFee = 50.0;

//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!userId) {
//         setError("User not found. Please log in.");
//         return;
//       }

//       try {
//         const { data } = await axiosInstance.get(`/cart/${userId}`);
//         setCart(data.items);
//         console.log("Cart Data:", data);
//       } catch (error) {
//         console.error("Error fetching cart:", error.response?.data.message || error.message);
//         setError("Failed to fetch cart items.");
//       }
//     };

//     fetchCart();

//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setGpsLocation({
//             type: "Point",
//             coordinates: [longitude, latitude],
//           });
//           console.log("GPS Location:", { latitude, longitude });
//           alert("Location retrieved successfully!");
//         },
//         (error) => {
//           console.error("Error retrieving location:", error.message);
//           alert("Failed to retrieve GPS location. Please enter your address manually.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by your browser.");
//     }
//   }, [userId]);

//   const handlePaymentMethodChange = (e) => {
//     setPaymentMethod(e.target.value);
//   };

//   const handleProofUpload = async (e) => {
//     e.preventDefault();
//     if (!gcashNumber || !proofImage) {
//       alert("Please provide your GCash number and upload the proof of payment.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("userId", userId);
//     formData.append("gcashNumber", gcashNumber);
//     formData.append("proofImage", proofImage);

//     try {
//       await axiosInstance.post("/payment-proof/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Proof of payment uploaded successfully.");
//     } catch (error) {
//       alert("Failed to upload proof of payment.");
//     }
//   };

//   const handleCheckout = async () => {
//     if (!gpsLocation) {
//       alert("Please enable GPS to use your current location.");
//       return;
//     }

//     if (paymentMethod === "GCash") {
//       if (!gcashNumber || gcashNumber.length !== 11) {
//         alert("Please enter a valid GCash number.");
//         return;
//       }

//       setIsProcessing(true);

//       setTimeout(() => {
//         setIsProcessing(false);
//         alert("Payment successful via GCash!");
//         submitOrder("Paid");
//       }, 3000);
//     } else {
//       submitOrder("Pending");
//     }
//   };

//   const submitOrder = async (paymentStatus) => {
//     try {
//       await axiosInstance.post(`/orders/checkout/${userId}`, {
//         gpsLocation, // GPS location as GeoJSON
//         manualAddress, // Optional manual address
//         paymentMethod,
//         paymentStatus,
//       });

//       alert("Order placed successfully!");
//       navigate("/orders/ongoing");
//     } catch (error) {
//       console.error("Error placing order:", error.response?.data.message || error.message);
//       alert("Failed to place order. Please check your location and try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-6 font-serif">
//       <h1 className="text-center text-4xl font-bold mb-8">Checkout</h1>

//       {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}

//       {cart.length > 0 ? (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
//             <div className="grid grid-cols-1">
//               <div className="bg-zinc-300 px-2 items-center shadow-md flex justify-between text-lg font-bold">
//                 <h2>Item name:</h2>
//                 <h2>Quantity:</h2>
//                 <h2>Price:</h2>
//               </div>
//               {cart.map((item) => (
//                 <div key={item.product._id} className="bg-white px-2 items-center shadow-md flex justify-between">
//                   <h2 className="font-semibold">{item.product.name}</h2>
//                   <p>{item.quantity}</p>
//                   <p>{item.price * item.quantity}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6">
//               <label className="block font-semibold">Manual Address (Optional):</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-md"
//                 placeholder="e.g., 222 Palayan Street, Donacion, Angat, Bulacan"
//                 value={manualAddress}
//                 onChange={(e) => setManualAddress(e.target.value)}
//               />
//             </div>

//             <div className="mt-6 flex justify-between">
//               <div>
//                 <label className="block font-semibold">Select Payment Method:</label>
//                 <div className="flex gap-4 mt-2">
//                   <label className="cursor-pointer">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="GCash"
//                       checked={paymentMethod === "GCash"}
//                       onChange={handlePaymentMethodChange}
//                     />
//                     <span className="ml-2">GCash</span>
//                   </label>
//                   <label className="cursor-pointer">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="Cash on Delivery"
//                       checked={paymentMethod === "Cash on Delivery"}
//                       onChange={handlePaymentMethodChange}
//                     />
//                     <span className="ml-2">Cash on Delivery</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="mx-6 text-right tracking-wide text-lg">
//                 <p>Product Price: {totalPrice}</p>
//                 <p>Delivery Fee: {deliveryFee}</p>
//                 <p className="font-bold">Total Price: {totalPrice + deliveryFee}</p>
//               </div>
//             </div>

//             {/* GCash Number Input and Proof Upload */}
//             {paymentMethod === "GCash" && (
//               <div className="mt-6">
//                 <div className="my-5 bg-zinc-400 py-6 rounded-lg">
//                   <h2 className="block  text-2xl font-semibold text-center">Send your GCash payment on this number</h2>
//                   <h2 className="block font-semibold text-3xl text-center">0999 503 1403</h2>
//                 </div>

//                 <label className="block font-semibold">Your GCash Number:</label>

//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded-lg"
//                   placeholder="Enter your GCash number in case of refunds"
//                   value={gcashNumber}
//                   onChange={(e) => setGcashNumber(e.target.value)}
//                 />
//                 <label className="block mt-4 font-semibold">Upload Proof of Payment: (Screenshot of GCash payment receipt)</label>
//                 <input
//                   type="file"
//                   className="w-full p-2 border rounded-md"
//                   onChange={(e) => setProofImage(e.target.files[0])}
//                 />
//                 <button
//                   className="mt-4 bg-zinc-800 text-white px-4 py-2 rounded-md hover:bg-zinc-600 transition cursor-pointer"
//                   onClick={handleProofUpload}
//                 >
//                   Upload Proof
//                 </button>
//               </div>
//             )}

//             {isProcessing && <p className="text-green-600 text-center">Processing payment...</p>}
//           </div>

//           <button
//             className="bg-zinc-800 text-white px-6 py-3 rounded-lg mt-6 cursor-pointer mx-atuo hover:bg-zinc-600"
//             onClick={handleCheckout}
//           >
//             Place Order
//           </button>
//         </>
//       ) : (
//         <p className="text-gray-500 text-center">Your cart is empty.</p>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [cart, setCart] = useState([]);
  const [variantData, setVariantData] = useState({});
  const [gpsLocation, setGpsLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [purchaseType, setPurchaseType] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [gcashNumber, setGcashNumber] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart from backend
        const { data } = await axiosInstance.get(`/cart/${userId}`);
        setCart(data.items);

        // Load variant info from localStorage
        const cartVariants = JSON.parse(localStorage.getItem('cartVariants') || '[]');
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
      } catch (error) {
        setError("Failed to fetch cart items.");
      }
    };

    fetchData();

    // Get GPS location only for delivery orders
    if (purchaseType === "Delivery" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          });
        },
        (error) => console.error("GPS Error:", error)
      );
    }
  }, [userId, purchaseType]);

  const calculateTotals = () => {
    let subtotal = 0;
    const items = [];

    cart.forEach(item => {
      const variants = variantData[item.product._id] || [{ variant: 'hot', price: item.price }];
      
      variants.forEach(variant => {
        const price = variant.price;
        const quantity = variant.quantity || 1;
        subtotal += price * quantity;
        
        items.push({
          productId: item.product._id,
          name: item.product.name,
          variant: variant.variant,
          price,
          quantity
        });
      });
    });

    const deliveryFee = purchaseType === "Delivery" ? 50 : 0;
    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total, items };
  };

  const handleProofUpload = async (e) => {
        e.preventDefault();
        if (!gcashNumber || !proofImage) {
          alert("Please provide your GCash number and upload the proof of payment.");
          return;
        }
    
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("gcashNumber", gcashNumber);
        formData.append("proofImage", proofImage);
    
        try {
          await axiosInstance.post("/payment-proof/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Proof of payment uploaded successfully.");
        } catch (error) {
          alert("Failed to upload proof of payment.");
        }
      };

  const handleCheckout = async () => {
    // Only validate GPS for delivery orders
    if (purchaseType === "Delivery") {
      if (!gpsLocation) {
        alert("Please enable GPS for delivery");
        return;
      }

      if (
        !gpsLocation ||
        gpsLocation.type !== "Point" ||
        !Array.isArray(gpsLocation.coordinates) ||
        gpsLocation.coordinates.length !== 2
      ) {
        alert("Invalid GPS location format. Please enable location services.");
        return;
      }
    }

    if (paymentMethod === "GCash" && (!gcashNumber || gcashNumber.length !== 11)) {
      alert("Please enter a valid GCash number");
      return;
    }

    setIsProcessing(true);

    try {
      const { items } = calculateTotals();
      
      await axiosInstance.post(`/orders/checkout/${userId}`, {
        items,
        gpsLocation: purchaseType === "Delivery" ? gpsLocation : undefined,
        manualAddress: purchaseType === "Delivery" ? manualAddress : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === "GCash" ? "Paid" : "Pending",
        purchaseType
      });

      // Clear cart variants from localStorage after successful checkout
      localStorage.removeItem('cartVariants');
      
      alert("Order placed successfully!");
      navigate("/orders/ongoing");
    } catch (error) {
      setError(error.response?.data?.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const { subtotal, deliveryFee, total } = calculateTotals();

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif">
      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>

      {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-4">{error}</p>}

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Cart Items */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>
            {cart.flatMap(item => {
              const variants = variantData[item.product._id] || [{ variant: 'hot', price: item.price, quantity: 1 }];
              return variants.map((variant, index) => (
                <div key={`${item.product._id}-${variant.variant}-${index}`} className="flex justify-between py-2 border-b">
                  <span>
                    {item.product.name} ({variant.variant.toUpperCase()})
                  </span>
                  <span>
                    {variant.quantity || 1} × ₱{variant.price}
                  </span>
                </div>
              ));
            })}
          </div>

          {/* Right Column - Checkout Form */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Order Type</h2>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={purchaseType === "Delivery"}
                    onChange={() => setPurchaseType("Delivery")}
                  />
                  Delivery
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={purchaseType === "Dine In"}
                    onChange={() => setPurchaseType("Dine In")}
                  />
                  Dine In
                </label>
              </div>

              {purchaseType === "Delivery" && (
                <>
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    className="w-full p-2 border rounded mb-4"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                  />

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Payment Method</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="GCash">GCash</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>
                </>
              )}

              {purchaseType === "Dine In" && (
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Payment Method</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="GCash">GCash</option>
                  </select>
                </div>
              )}

              {paymentMethod === "GCash" && (
                <div className="space-y-2">
                  <div className="bg-blue-50 p-4 rounded mb-2">
                    <p className="font-bold text-center">Send payment to:</p>
                    <p className="text-xl font-bold text-center">0999 503 1403</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Your GCash Number"
                    className="w-full p-2 border rounded"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                  />
                  <label className="block mt-4 font-semibold">Upload Proof of Payment: (Screenshot of GCash payment receipt)</label>
                  <input
                    type="file"
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => setProofImage(e.target.files[0])}
                  />
                  <button
                    className="mt-4 bg-zinc-800 text-white px-4 py-2 rounded-md hover:bg-zinc-600 transition cursor-pointer"
                    onClick={handleProofUpload}
                  >
                    Upload Proof
                </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                {purchaseType === "Delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>₱{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-3 rounded-lg font-bold text-white ${
                isProcessing ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              } transition`}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty</p>
      )}
    </div>
  );
};

export default CheckoutPage;