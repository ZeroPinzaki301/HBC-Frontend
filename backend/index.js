import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import messageRouter from "./routes/message.route.js";
import paymentRouter from "./routes/payment.route.js";
import { notifyAdminOfLowStock } from "./utils/lowStockNotifier.js";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://hype-beans-cafe-pip9.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Database Connection
connectDB();

// Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for production)
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Socket.IO Events
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/payment-proof", paymentRouter);

// Static Files (Uploads)
app.use("/uploads", express.static("uploads"));

// Low Stock Notifier (Runs hourly)
setInterval(() => {
  notifyAdminOfLowStock();
}, 3600000);

// ================== CRITICAL FIXES ================== //
// 1. Serve static files from the CORRECT frontend folder
const __dirname = path.resolve();
const frontendFolder = process.env.FRONTEND_BUILD_FOLDER || "dist";
const frontendPath = path.join(__dirname, "..", "frontend", frontendFolder); // Fixed path

app.use(express.static(frontendPath));

// Catch-all route (EXCLUDES /api routes)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error Handling Middleware (Add this last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
