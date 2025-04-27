import express from "express";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";
import { io } from "../index.js";

const router = express.Router();

// Place an Order (with text or GeoJSON location) and notify admin in real-time
router.post("/checkout/:userId", async (req, res) => {
  const { userId } = req.params;
  const { paymentMethod, gpsLocation, manualAddress, purchaseType = "Delivery" } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderData = {
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod,
      paymentStatus: paymentMethod === "GCash" ? "Paid" : "Pending",
      status: "Pending",
      purchaseType,
    };

    if (purchaseType === "Delivery") {
      if (
        !gpsLocation ||
        gpsLocation.type !== "Point" ||
        !Array.isArray(gpsLocation.coordinates) ||
        gpsLocation.coordinates.length !== 2
      ) {
        return res.status(400).json({
          message: "Invalid GPS location format for delivery. Must be [longitude, latitude].",
        });
      }
      orderData.deliveryLocation = gpsLocation; // Include deliveryLocation for Delivery
      orderData.manualAddress = manualAddress || ""; // Optional for Delivery
    } else if (purchaseType === "Dine In") {
      // Explicitly set deliveryLocation to null for Dine In
      orderData.deliveryLocation = null; 
      orderData.manualAddress = undefined; // Exclude manualAddress
    }

    const order = new Order(orderData);
    await order.save();

    // Clear the cart
    await Cart.findOneAndDelete({ user: userId });

    // Notify admins
    io.emit("new-order", {
      _id: order._id,
      user: userId,
      status: order.status,
      deliveryLocation: order.deliveryLocation,
      items: order.items,
      purchaseType: order.purchaseType,
    });

    res.status(200).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error during checkout:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fetch Specific Order History for User
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({
      user: userId,
      status: { $in: ["Delivered", "Canceled"] },
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order history.",
      error: error.message
    });
  }
});

// Fetch Ongoing Orders for User
router.get("/ongoing/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({
      user: userId,
      status: { $nin: ["Delivered", "Canceled"] },
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ongoing orders.",
      error: error.message
    });
  }
});

// Cancel an Order
router.put("/cancel/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    if (order.status !== "Preparing" && order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only orders in 'Preparing' or 'Pending' stage can be canceled."
      });
    }

    order.status = "Canceled";
    await order.save();

    io.emit("order-canceled", order);
    io.emit("order-status-changed", order);

    res.status(200).json({
      success: true,
      message: "Order canceled successfully.",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel the order.",
      error: error.message
    });
  }
});

// Update Admin's Real-Time GPS Location (for tracking)
router.put("/update-location/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { adminLocation } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      !adminLocation ||
      !Array.isArray(adminLocation.coordinates) ||
      adminLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message: "Invalid GPS format. Must be [longitude, latitude]."
      });
    }

    order.adminLocation = adminLocation;
    await order.save();

    res.status(200).json({
      message: "Admin location updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update admin location.",
      error: error.message
    });
  }
});

// Admin Views All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user items.product");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders.",
      error: error.message
    });
  }
});

// Update Order Status (Admin)
router.put("/update-status/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if ((status === "Out for Delivery" || status === "Delivered") && order.status !== status) {
      for (const item of order.items) {
        const product = item.product;
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({
              message: `Insufficient stock for product: ${product.name}`,
            });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    io.emit("order-status-changed", { _id: order._id, status: order.status });

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({
      message: "Failed to update order status.",
      error: error.message
    });
  }
});

// Fetch Specific Order
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("user items.product");
    if (!order) return res.status(404).json({ message: "Order not found." });

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order details.",
      error: error.message
    });
  }
});

export default router;