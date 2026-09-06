import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure environment variables are loaded
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: "./.env" });

const app = express();

// Helper to determine allowed origins dynamically from CLIENT_URL and development defaults
const getAllowedOrigins = () => {
  const allowed = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ]);

  // Primary: Support CLIENT_URL from environment (e.g. http://localhost:5173 or Vercel production domain)
  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(",").forEach((url) => {
      const trimmed = url.trim().replace(/\/$/, "");
      if (trimmed) allowed.add(trimmed);
    });
  }

  // Fallback: Support CORS_ORIGIN for backward compatibility
  if (process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN.split(",").forEach((url) => {
      const trimmed = url.trim().replace(/\/$/, "");
      if (trimmed) allowed.add(trimmed);
    });
  }

  return allowed;
};

// Production CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/$/, "");
    const allowedOrigins = getAllowedOrigins();

    if (allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true);
    }

    // Support production and preview Vercel domains if applicable
    if (/^https:\/\/[\w.-]+\.vercel\.app$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 204,
};

// 1. CORS Middleware - MUST run before body parsers and routes for proper preflight handling
app.use(cors(corsOptions));

// 2. Standard Parsers & Static Files
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome To My First Express Server");
});

import healthCheckRouter from "./routes/healthCheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import categoryRouter from "./routes/category.routes.js";
import cartRouter from "./routes/cart.routes.js";
import productRouter from "./routes/product.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import paymentsRouter from "./routes/payments.routes.js";
import wishlistRouter from "./routes/wishlists.routes.js";
import configureRouter from "./routes/configure.routes.js";

app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/configure", configureRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image file is too large. Maximum size allowed is 5MB.";
    } else {
      message = err.message || "File upload error";
    }
  } else if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err.errors || [],
  });
});

export default app;
