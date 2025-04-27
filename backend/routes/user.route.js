import express from "express";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailVerification.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use environment variable for better security

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, phone, agreedToPolicy } = req.body;

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      // Ensure the user has agreed to the terms
      if (!agreedToPolicy) {
          return res.status(400).json({ message: "You must agree to the Privacy Policy and Terms and Conditions." });
      }

      // Hash password for security
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      // Save user in the database
      const user = new User({
          name,
          email,
          password: hashedPassword,
          phone,
          verificationCode,
          agreedToPolicy,
          agreedAt: new Date(), // Set the timestamp of agreement
      });
      await user.save();

      // Send verification email
      await sendEmail(
          email,
          "HypeBeans Verification Code",
          `Hello ${name}, your HypeBeans verification code is: ${verificationCode}`
      );

      res.status(201).json({ message: "User registered. Verification code sent via email." });
  } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Verify Email Route
router.post("/verify", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check the verification code
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationCode = null; // Clear the verification code after success
    await user.save();

    // Generate JWT token for immediate login
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ 
      message: "Verification successful", 
      token,
      user: {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified
      } });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid or incorrect password" });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "7d" });

    // Admin verification flow
    if (user.isAdmin) {
      // Generate a 6-digit verification code for admin users
      const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit code
      user.verificationCode = verificationCode; // Save verification code to the admin user's record
      await user.save(); // Save the updated user information

      // Send verification code via email
      await sendEmail(
        email,
        "HypeBeans Admin Verification Code",
        `Your admin login verification code is: ${verificationCode}`
      );

      return res.status(200).json({
        message: "Admin verification code sent via email. Please verify to continue.",
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      });
    }

    // Non-admin login response
    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Admin Verification Route
router.post("/admin-verify", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) {
      console.log("Admin not found for email:", email); // Debug log
      return res.status(404).json({ message: "Admin not found" });
    }

    if (user.verificationCode !== verificationCode) {
      console.log("Verification code mismatch:", user.verificationCode, verificationCode); // Debug log
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.verificationCode = null; // Clear verification code
    await user.save();
    res.status(200).json({ message: "Admin login successful" });
  } catch (error) {
    console.error("Admin Verification Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/account", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    const user = await User.findById(decoded.id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Account Fetch Error:", error);
    res.status(500).json({ message: "Invalid or expired token." });
  }
});

// Edit Profile
router.put("/update-profile", async (req, res) => {
  const { name, phone } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user details
    user.name = name || user.name;
    user.phone = phone || user.phone;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete Account
router.delete("/delete", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByIdAndDelete(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;