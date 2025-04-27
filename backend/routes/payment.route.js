import express from "express";
import multer from "multer";
import PaymentProof from "../models/Payment.model.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/payment-proof"); // Save files in "payment-proof" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid name clashes
  },
});

const upload = multer({ storage });

// Route to upload payment proof
router.post("/upload", upload.single("proofImage"), async (req, res) => {
  const { userId, gcashNumber } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const newProof = new PaymentProof({
      userId,
      gcashNumber,
      proofImage: req.file.path,
    });
    await newProof.save();

    res.status(201).json({ message: "Payment proof uploaded successfully." });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Route to retrieve all payment proofs (for admin)
router.get("/all", async (req, res) => {
  try {
    const proofs = await PaymentProof.find().populate("userId", "name email");
    res.status(200).json(proofs);
  } catch (error) {
    console.error("Error fetching payment proofs:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

export default router;