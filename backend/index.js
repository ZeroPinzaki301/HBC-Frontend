// Import necessary modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Import routers
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import messageRouter from "./routes/message.route.js";
import paymentRouter from "./routes/payment.route.js";

// Import utility functions
import { notifyAdminOfLowStock } from "./utils/lowStockNotifier.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set CORS options
const corsOptions = {
  origin: 'https://hype-beans-cafe-pip9.onrender.com', // Change if frontend domain changes
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For testing; tighten in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Handle admin socket connections
io.on("connection", (socket) => {
  console.log(`Admin connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Admin disconnected: ${socket.id}`);
  });
});

// Export io for use in other files
export { io };

// API routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/payment-proof", paymentRouter);

// Static folder for uploads
app.use("/uploads", express.static("uploads"));

// ===== Serve Frontend =====

// Fix __dirname since we are using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from frontend build
const frontendPath = path.join(__dirname, "../frontend/build"); // Adjust if your structure is different
app.use(express.static(frontendPath));

// Serve index.html for any unknown routes (let React Router handle routing)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// ===== End Serve Frontend =====

// Run low stock notifier every hour
setInterval(() => {
  notifyAdminOfLowStock();
}, 3600000); // 1 hour = 3600000 ms

// Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
