import React, { useState, useEffect } from "react";

const ProductModal = ({ closeModal, saveProduct, editingProduct }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    productType: "beverages", // Default value
    beverageType: "",
    imageFile: null,
  });

  useEffect(() => {
    // Populate the form with existing product details if editing
    if (editingProduct) {
      setProduct({
        ...editingProduct,
        imageFile: null, // Reset image file for existing product edits
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
      // Reset beverageType if productType changes to "delights"
      ...(name === "productType" && value === "delights" ? { beverageType: "" } : {}),
    }));
  };

  const handleFileChange = (e) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      imageFile: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the required fields
    if (!product.name || !product.price || !product.description || !product.stock || !product.productType) {
      alert("Please fill out all required fields.");
      return;
    }

    // Additional validation for beverages
    if (product.productType === "beverages" && !product.beverageType) {
      alert("Please select a beverage type.");
      return;
    }

    // Pass product data and image file to the parent component
    saveProduct(product, product.imageFile);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded-lg"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded-lg"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded-lg"
            required
          ></textarea>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded-lg"
            required
          />
          <select
            name="productType"
            value={product.productType}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded-lg"
            required
          >
            <option value="beverages">Beverages</option>
            <option value="delights">Delights</option>
          </select>

          {/* Conditional Rendering for Beverage Type */}
          {product.productType === "beverages" && (
            <select
              name="beverageType"
              value={product.beverageType}
              onChange={handleChange}
              className="w-full p-2 border mb-4 rounded-lg"
            >
              <option value="">Select Beverage Type</option>
              <option value="espresso based">Espresso Based</option>
              <option value="coffee based frappe">Coffee Based Frappe</option>
              <option value="non-coffee based">Non-Coffee Based</option>
              <option value="non-coffee based frappe">Non-Coffee Based Frappe</option>
              <option value="refreshments">Refreshments</option>
              <option value="cold brew specials">Cold Brew Specials</option>
            </select>
          )}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-2 border mb-4 rounded-lg"
          />
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;