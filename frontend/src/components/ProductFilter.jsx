const ProductFilter = ({ selectedType, setSelectedType }) => {
    return (
      <div className="flex justify-center space-x-4 my-6">
        <button
          className={`px-4 py-2 rounded-xl ${
            selectedType === "all" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setSelectedType("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            selectedType === "beverages" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setSelectedType("beverages")}
        >
          Beverages
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            selectedType === "delights" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setSelectedType("delights")}
        >
          Delights
        </button>
      </div>
    );
  };
  
  export default ProductFilter;