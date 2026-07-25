import { body, param } from "express-validator";

export const addToCartValidator = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid Product ID"),
];

export const updateCartQuantityValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid Product ID"),

    body("action")
        .notEmpty()
        .withMessage("Action is required")
        .isIn(["increase", "decrease"])
        .withMessage("Action must be either 'increase' or 'decrease'"),
];

export const removeFromCartValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid Product ID"),
];