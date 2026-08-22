import { body } from "express-validator";

export const createPaymentValidator = [
    body("orderId")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("paymentMethod")
        .isIn(["UPI", "CARD", "NET_BANKING"])
        .withMessage("Invalid payment method"),
];