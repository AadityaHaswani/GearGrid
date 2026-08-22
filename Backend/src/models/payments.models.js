import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["UPI", "CARD", "NET_BANKING"],
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Success", "Failed", "Refunded"],
            default: "Pending",
        },

        gatewayOrderId: {
            type: String,
        },

        gatewayPaymentId: {
            type: String,
        },

        gatewaySignature: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);