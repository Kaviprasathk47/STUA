import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import VehicleRoutes from "./routes/vehicleRoute.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";
import emissionRoutes from "./routes/emissionRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import userGradeRoutes from "./routes/userGradeRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
// import adminRoutes from "./routes/adminRoutes.js";
import logger from "./utils/logger.js";

dotenv.config();

connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Apply rate limiting to all API routes
app.use(apiLimiter);

// Routes
app.use("/", userRoutes);
// app.use("/admin",adminRoutes)
app.use("/Vehicle", VehicleRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/travel", travelRoutes);
app.use("/api/emissions", emissionRoutes);
app.use("/analysis", analysisRoutes);
app.use("/user-grade", userGradeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
