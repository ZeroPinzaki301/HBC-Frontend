// backend/index.js (or server.js)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // To create server
import { Server } from "socket.io"; // For real-time communication
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import messageRouter from "./routes/message.route.js";
import paymentRouter from "./routes/payment.route.js";
import { notifyAdminOfLowStock } from "./utils/lowStockNotifier.js";

// For serving frontend files correctly
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Setup __dirname because we are using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup CORS options
const corsOptions = {
  origin: 'https://hype-beans-cafe-pip9.onrender.com', // Update if you have a custom domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // For simplicity, allow all origins — secure this in production!
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Admin real-time notifications
io.on("connection", (socket) => {
  console.log(`Admin connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Admin disconnected: ${socket.id}`);
  });
});

// Export io so other modules can use it
export { io };

// Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/payment-proof", paymentRouter);

// Serving uploaded files (like images)
app.use("/uploads", express.static("uploads"));

// 🛠 Serving the Frontend (corrected to dist folder!)
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

// Catch-all handler: serve index.html for any unmatched route (important for React Router!)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// Low stock email notifier — runs every hour
setInterval(() => {
  notifyAdminOfLowStock();
}, 3600000); // 3600000 ms = 1 hour

// Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
