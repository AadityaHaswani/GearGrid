import { Payment } from "../models/payments.models.js";
import { Order } from "../models/orders.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const existingPayment = await Payment.findOne({
        order: order._id,
    }).sort({ createdAt: -1 });

    if (
        existingPayment &&
        ["Pending", "Success", "Refunded"].includes(existingPayment.status)
    ) {
        throw new ApiError(
            400,
            `Payment cannot be initiated because the latest payment is ${existingPayment.status}`
        );
    }

    const amount = order.totalAmount;

    const payment = await Payment.create({
        order: order._id,
        user: req.user._id,
        amount,
        paymentMethod,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            payment,
            "Payment initiated successfully"
        )
    );
});