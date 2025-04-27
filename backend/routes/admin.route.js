import express from 'express';
import User from '../models/User.model.js';
import Order from '../models/Order.model.js';

const router = express.Router();

// Helper function to convert relative paths to absolute URLs
const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  return `${req.protocol}://${req.get('host')}${imagePath}`;
};

// Admin's overview for regular users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/sales-summary", async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$items.price" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalSales: 1,
        },
      },
    ]);
    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching sales summary:", error.message);
    res.status(500).json({
      message: "Failed to fetch sales summary.",
      error: error.message,
    });
  }
});

router.get("/most-sold/week", async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const product = await Order.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo }, status: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: ["$productDetails.name", 0] },
          image: { $arrayElemAt: ["$productDetails.image", 0] },
          quantity: 1,
        },
      },
    ]);

    if (product.length === 0) {
      return res.status(200).json({ message: "No data available for this week." });
    }

    const result = {
      ...product[0],
      image: getFullImageUrl(req, product[0].image),
    };

    res.status(200).json({ product: result });
  } catch (err) {
    console.error("Error fetching most sold product of the week:", err.message);
    res.status(500).json({ 
      message: "Failed to fetch most sold product of the week.", 
      error: err.message 
    });
  }
});

router.get("/most-sold/month", async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const product = await Order.aggregate([
      { $match: { createdAt: { $gte: oneMonthAgo }, status: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: ["$productDetails.name", 0] },
          image: { $arrayElemAt: ["$productDetails.image", 0] },
          quantity: 1,
        },
      },
    ]);

    if (product.length === 0) {
      return res.status(200).json({ message: "No data available for this month." });
    }

    const result = {
      ...product[0],
      image: getFullImageUrl(req, product[0].image),
    };

    res.status(200).json({ product: result });
  } catch (err) {
    console.error("Error fetching most sold product of the month:", err.message);
    res.status(500).json({ 
      message: "Failed to fetch most sold product of the month.", 
      error: err.message 
    });
  }
});

router.get("/most-sold/all-time", async (req, res) => {
  try {
    const product = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: ["$productDetails.name", 0] },
          image: { $arrayElemAt: ["$productDetails.image", 0] },
          quantity: 1,
        },
      },
    ]);

    if (product.length === 0) {
      return res.status(200).json({ message: "No data available for all time." });
    }

    const result = {
      ...product[0],
      image: getFullImageUrl(req, product[0].image),
    };

    res.status(200).json({ product: result });
  } catch (err) {
    console.error("Error fetching most sold product of all time:", err.message);
    res.status(500).json({ 
      message: "Failed to fetch most sold product of all time.", 
      error: err.message 
    });
  }
});

router.get("/products-sales-summary", async (req, res) => {
  try {
    const productsSalesData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: ["$productDetails.name", 0] },
          image: { $arrayElemAt: ["$productDetails.image", 0] },
          totalSold: 1,
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    const productsWithFullUrls = productsSalesData.map((product) => ({
      ...product,
      image: getFullImageUrl(req, product.image),
    }));

    res.status(200).json({ products: productsWithFullUrls });
  } catch (err) {
    console.error("Error fetching products sales summary:", err.message);
    res.status(500).json({ 
      message: "Failed to fetch products sales summary.", 
      error: err.message 
    });
  }
});

export default router;