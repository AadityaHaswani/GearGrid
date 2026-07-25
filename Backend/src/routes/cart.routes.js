import { Router } from "express";

import {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
} from "../controllers/cart.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.post("/", addToCartValidator, validate, addToCart);

router.get("/", getCart);

router.patch(
    "/:productId",
    updateCartQuantityValidator,
    validate,
    updateCartQuantity
);

router.delete(
    "/:productId",
    removeFromCartValidator,
    validate,
    removeFromCart
);

router.delete("/", clearCart);

export default router;