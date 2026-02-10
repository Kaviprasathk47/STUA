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

dotenv.config();

connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", userRoutes);
// app.use("/trips",tripRoutes);
app.use("/Vehicle", VehicleRoutes)
app.use("/dashboard", dashboardRoutes);
app.use("/travel", travelRoutes);
app.use("/api/emissions", emissionRoutes);
app.use("/analysis", analysisRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is runnning on the port ${PORT}`);
})