import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`}>
      <div key={product._id} className="bg-zinc-800 p-4 rounded-lg shadow-md">
        <img
          src={`${axiosInstance.defaults.baseURL.replace('/api', '')}/${product.image}`}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <h3 className="text-xl text-white text-center tracking-widest font-semibold">
          {product.name}
        </h3>
      </div>
    </Link>
  );
};

export default ProductCard;
