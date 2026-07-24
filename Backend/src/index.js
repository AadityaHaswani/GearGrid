import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/index.js"
import dns from "dns"


dns.setServers(["1.1.1.1","8.8.8.8"]);
dotenv.config({
    path:"./.env"
})

const port = process.env.PORT

connectDB()
.then(()=>{
    
app.listen(port,()=>{
    console.log(`Listening on Port:http://localhost:${port}`);
    
})
})
.catch((err)=>{
    console.error("MongoDB Connection Failed",err);
     
})
    