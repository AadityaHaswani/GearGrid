import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "Backend/.env" });

import { Order } from "../src/models/orders.models.js";
import { Payment } from "../src/models/payments.models.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo");

  const orders = await Order.find().sort({ createdAt: -1 }).limit(3).lean();
  console.log("Last 3 Orders:");
  console.dir(orders, { depth: null });

  const payments = await Payment.find().sort({ createdAt: -1 }).limit(3).lean();
  console.log("Last 3 Payments:");
  console.dir(payments, { depth: null });

  await mongoose.disconnect();
}

run().catch(console.error);
