import express from "express";
import Message from "../models/Message.model.js";

const router = express.Router();

// Submit a new message (Contact Page)
router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();
    res.status(201).json({ message: "Message submitted successfully." });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Fetch all messages (Admin Dashboard)
router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;