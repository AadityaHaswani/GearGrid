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
    const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.image,
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