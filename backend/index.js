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

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'https://hype-beans-cafe-pip9.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`Admin connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Admin disconnected: ${socket.id}`);
  });
});

export { io };

// API Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/payment-proof", paymentRouter);

app.use("/uploads", express.static("uploads"));

setInterval(() => {
  notifyAdminOfLowStock();
}, 3600000);

// Serve React build files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Catch-all route (skip API routes)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
