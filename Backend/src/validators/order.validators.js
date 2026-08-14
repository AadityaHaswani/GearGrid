import { param } from "express-validator";

export const getOrderByIdValidator = [
    param("orderId")
        .isMongoId()
        .withMessage("Invalid order ID"),
];

