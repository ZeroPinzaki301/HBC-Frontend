import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ProductModal from "../components/ProductModal";
import { Link } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Fetch Products Error:", err.response?.data?.message || err.message);
      }
    };

    const fetchLowStockProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products/low-stock");
        setLowStock(data);
      } catch (err) {
        console.error("Fetch Low-Stock Products Error:", err.response?.data?.message || err.message);
      }
    };

    fetchProducts();
    fetchLowStockProducts();
  }, []);

  // Add/Edit Product with Multer for image upload
  const handleSaveProduct = async (product, imageFile) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("stock", product.stock);
    formData.append("productType", product.productType);

    // Append beverageType only if productType is "beverages"
    if (product.productType === "beverages") {
      formData.append("beverageType", product.beverageType);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingProduct) {
        await axiosInstance.put(`/products/update/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/products/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      const { data } = await axiosInstance.get("/products");
      setProducts(data);
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product. Please try again.");
      console.error("Save Product Error:", err.response?.data?.message || err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`/products/delete/${productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (err) {
      setError("Failed to delete product. Please try again later.");
      console.error("Delete Product Error:", err.response?.data?.message || err.message);
    }
  };

  // Restock Product
  const handleRestock = async (productId, quantity) => {
    try {
      await axiosInstance.put(`/products/restock/${productId}`, { quantity });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, stock: product.stock + quantity } : product
        )
      );
    } catch (err) {
      setError("Failed to restock product. Please try again later.");
      console.error("Restock Product Error:", err.response?.data?.message || err.message);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products
    .filter((product) => (filterType === "all" ? true : product.productType === filterType))
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-serif relative">
      {/* Back Button */}
      <Link
        to="/admin-dashboard"
        className="absolute top-4 left-4 bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
      >
        Back to Dashboard
      </Link>

      <h1 className="text-center text-4xl font-bold mb-8">Manage Products</h1>

      {/* Error Handling */}
      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-4">
          {error}
        </p>
      )}

      <div className="flex">
        {/* Product Filtering */}
        <select
          className="mb-6 p-2 border rounded-lg cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="beverages">Beverages</option>
          <option value="delights">Delights</option>
        </select>

        {/* Add New Product Button */}
        <button
          className="flex bg-zinc-800 text-white ml-6 px-6 py-3 rounded-lg mb-6 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <IoIosAdd className="text-2xl mr-3" />
          Add New Product
        </button>
      </div>

      {/* Product Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentItems.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl tracking-widest font-semibold mb-2">{product.name}</h2>
            <p className="text-lg">Price: ₱{product.price}</p>
            <p className="text-lg">Stock: {product.stock}</p>
            <p className="text-lg">Type: {product.productType}</p>
            {product.productType === "beverages" && <p className="text-lg">Beverage Type: {product.beverageType}</p>}
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mt-4"
            />
            <div className="flex gap-4 mt-5">
              <button
                className="bg-zinc-800 text-white p-[.5em] rounded-lg cursor-pointer"
                onClick={() => {
                  setEditingProduct(product);
                  setShowModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-zinc-800 text-white p-[.5em] rounded-lg cursor-pointer"
                onClick={() => handleDeleteProduct(product._id)}
              >
                Delete
              </button>
              <button
                className="bg-zinc-800 text-white p-[.5em] rounded-lg cursor-pointer"
                onClick={() => handleRestock(product._id, 10)}
              >
                Restock +10
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1 ? "bg-zinc-600 text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-100 p-4 mt-8 rounded-lg">
          <h2 className="text-lg font-semibold">Low Stock Products:</h2>
          <ul>
            {lowStock.map((product) => (
              <li key={product._id}>
                {product.name} - Stock: {product.stock}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          closeModal={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          saveProduct={handleSaveProduct}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
};

export default ManageProducts;