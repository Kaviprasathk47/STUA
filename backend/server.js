import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import VehicleRoutes from "./routes/vehicleRoute.js";

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
app.use("/",userRoutes);
// app.use("/trips",tripRoutes);
app.use("/Vehicle",VehicleRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT ,() => {
    console.log(`Server is runnning on the port ${PORT}`);
})