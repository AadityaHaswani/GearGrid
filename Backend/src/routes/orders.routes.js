import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    placeOrder,
    getMyOrders,
    getOrderById,
} from "../controllers/orders.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { getOrderByIdValidator } from "../validators/order.validators.js";

const router = Router();
router.use(verifyJWT);
router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get(
    "/:orderId",
    getOrderByIdValidator,
    validate,
    getOrderById
);

export default router;