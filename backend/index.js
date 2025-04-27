import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
// Import all your route files
import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin.route.js';
import productRouter from './routes/product.route.js';
import orderRouter from './routes/order.route.js';
import cartRouter from './routes/cart.route.js';
import messageRouter from './routes/message.route.js';
import paymentRouter from './routes/payment.route.js';
import { notifyAdminOfLowStock } from './utils/lowStockNotifier.js';

// Configure environment
dotenv.config();

// Initialize Express
const app = express();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://hype-beans-cafe-pip9.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));

// Database Connection
connectDB();

// Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// API Routes (MUST COME BEFORE STATIC FILES)
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/messages', messageRouter);
app.use('/api/payment-proof', paymentRouter);

// Static Files (Uploads)
app.use('/uploads', express.static('uploads'));

// Low Stock Notifier
setInterval(() => {
  notifyAdminOfLowStock();
}, 3600000);

// ========== CRITICAL FIX ========== //
const frontendPath = path.join(__dirname, '../frontend/dist');

// Serve static files from Vite build
app.use(express.static(frontendPath));

// SPA Fallback Route - MUST BE LAST
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) return next();
  
  // Serve index.html for all other routes
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving frontend from: ${frontendPath}`);
});

export { io };
