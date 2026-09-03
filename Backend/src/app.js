import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()
export default app
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))


app.use(cookieParser())


app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",")||"http://localhost:5173",
    credentials:true,
    methods :["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]
}))
app.get("/",(req, res)=>{
    res.send("Welcome To My First Express Server");
    
      
})

import healthCheckRouter from "./routes/healthCheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import categoryRouter from "./routes/category.routes.js";
import cartRouter from "./routes/cart.routes.js";
import productRouter from "./routes/product.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import paymentsRouter from "./routes/payments.routes.js";

import wishlistRouter from "./routes/wishlists.routes.js";

app.use("/api/v1/wishlist", wishlistRouter);

app.use("/api/v1/payments", paymentsRouter);


app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", ordersRouter);

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


