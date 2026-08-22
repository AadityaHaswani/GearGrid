import { param } from "express-validator";

export const wishlistProductValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product ID"),
];