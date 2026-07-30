import { body, param } from "express-validator";

const addToCartValidator = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid Product ID"),
];
 const updateCartQuantityValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid Product ID"),

    body("action")
        .notEmpty()
        .withMessage("Action is required")
        .isIn(["increase", "decrease"])
        .withMessage("Action must be either 'increase' or 'decrease'"),
];
 const removeFromCartValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid Product ID"),
];
export{
    addToCartValidator,
    updateCartQuantityValidator,
    removeFromCartValidator

}