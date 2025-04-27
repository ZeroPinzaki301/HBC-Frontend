import express from "express";
import Cart from "../models/Cart.model.js";

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
    const { userId, productId, quantity, price } = req.body;
    
    console.log("Request Body:", req.body); // Debugging request body
  
    try {
      let cart = await Cart.findOne({ user: userId }); // Ensure userId is valid
      if (!cart) {
        cart = new Cart({ user: userId, items: [] }); // Initialize cart with user
      }
  
      const existingItem = cart.items.find((item) => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
  
      await cart.save();
      res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
      console.error("Error in /cart/add:", error.message); // Debugging error
      res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Update cart item quantity
router.put("/update/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (item) {
      item.quantity = quantity;
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error in /cart/update:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Remove item from cart
router.delete("/remove/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error in /cart/remove:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get cart items for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in /cart/:userId:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;