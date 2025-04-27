import express from 'express';
import Product from '../models/Product.model.js';
import { productUpload } from '../utils/multer.js';

const router = express.Router();

// Create Product Route
router.post("/create", productUpload.single("image"), async (req, res) => {
    const { name, price, description, stock, productType, beverageType } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
  
    // Validate required fields
    if (!name || !price || !description || !stock || !productType) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    if (productType === "beverages" && !beverageType) {
      return res.status(400).json({ message: "Beverage type is required for beverages." });
    }
  
    try {
      const newProduct = new Product({ name, price, description, stock, productType, beverageType, image });
      await newProduct.save();
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Server Error", error: error.message });
    }
});
  

// Update/Edit Product Route
router.put("/update/:id", productUpload.single("image"), async (req, res) => {
    const { name, price, description, stock, productType, beverageType } = req.body;
  
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.stock = stock || product.stock;
      product.productType = productType || product.productType;
      product.beverageType = beverageType || product.beverageType;
      if (req.file) {
        product.image = `uploads/${req.file.filename}`;
      }
  
      const updatedProduct = await product.save();
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  

// Delete Product Route
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct) return res.status(404).json({ message: "Product not found"});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Fetch/Get all the Product Route
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Fetch Specific Product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/restock/:id", async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const product = await Product.findById(id);
        if(!product) return res.status(404).json({ message: "Productn not found" });

        product.stock += quantity;
        await product.save();

        res.status(200).json({ message: "Stock updated successfully", product });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message});
    }
});



export default router;