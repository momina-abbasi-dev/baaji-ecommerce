import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing. Please configure it in your environment."
  );
}
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import connectDB from "./config/db.js";

// Connect to DB
connectDB();

const app = express();

// ------------------- CORS Setup -------------------
const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  "https://www.baajibyhinafahad.com",      // frontend
  "https://baajibyhinafahad.com",          // without www
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers
  })
);

// ------------------- Middleware -------------------
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

// Uploaded media is handled through ImageKit.

// ------------------- Health Check -------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ------------------- Routes -------------------
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// ------------------- Error Handling -------------------
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err.message);
  if (err.message && err.message.startsWith("Not allowed by CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || "Server Error" });
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});