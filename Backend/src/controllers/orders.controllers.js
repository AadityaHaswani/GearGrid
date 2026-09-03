import { Cart } from "../models/cart.models.js";
import { Order } from "../models/orders.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const placeOrder = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({
        user: req.user._id,
    }).populate("items.product");
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    if (cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }
    for (const item of cart.items) {
        if (!item.product) {
            throw new ApiError(
                400,
                "One or more products in your cart no longer exist"
            );
        }
    }


    const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.title,
        image: item.product.images[0] || "",
        price: item.product.price,
        quantity: item.quantity,
    }));
    const totalAmount = orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        totalAmount,
    });
    cart.items = [];
    await cart.save();
    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order placed successfully"
        )
    );

});
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
    });
    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );

});
export const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully"
        )
    );
});