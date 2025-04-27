import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Processing", "Preparing", "Out for Delivery", "Delivered", "Canceled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["GCash", "Cash on Delivery", "Cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transactionId: { type: String, default: null },

    deliveryLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: null, // Default is null for Dine In
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (value) {
            // Skip validation if coordinates are not present
            return !value || (Array.isArray(value) && value.length === 2);
          },
          message: "Coordinates must include longitude and latitude",
        },
      },
    },

    manualAddress: { type: String, default: "" },

    adminLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: false },
    },

    purchaseType: { type: String, enum: ["Delivery", "Dine In"], required: true },
  },
  { timestamps: true }
);

// Enable GeoJSON Indexing for location-based queries
orderSchema.index({ deliveryLocation: "2dsphere" });

export default mongoose.model("Order", orderSchema);