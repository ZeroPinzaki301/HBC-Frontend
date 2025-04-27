import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // Import http to create a server
import { Server } from "socket.io"; // Import Socket.IO
import path from "path"; // Import path for serving static files
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import messageRouter from "./routes/message.route.js";
import paymentRouter from "./routes/payment.route.js";
import { notifyAdminOfLowStock } from "./utils/lowStockNotifier.js";

dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'https://hype-beans-cafe-pip9.onrender.com', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict to necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Initialize HTTP server and Socket.IO
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; secure in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Admin connection for real-time notifications
io.on("connection", (socket) => {
  console.log(`Admin connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Admin disconnected: ${socket.id}`);
  });
});

// Export io for use in other files
export { io };

// Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/payment-proof", paymentRouter);

app.use("/uploads", express.static("uploads"));

// Function that sends email to the admin for low stocks every hour
setInterval(() => {
  notifyAdminOfLowStock();
}, 3600000);

// Serve static files (React frontend build)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));

// Catch-All Route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
