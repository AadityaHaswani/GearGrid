import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "../controllers/wishlists.controllers.js";
import { wishlistProductValidator } from "../validators/wishlists.validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post(
    "/:productId",
    wishlistProductValidator,
    validate,
    addToWishlist
);

router.get("/", getWishlist);

router.delete(
    "/:productId",
    wishlistProductValidator,
    validate,
    removeFromWishlist
);

export default router;