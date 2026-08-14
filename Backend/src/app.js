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


app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);

app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", ordersRouter);


