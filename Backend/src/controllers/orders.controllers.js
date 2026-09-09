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

    // Self-healing sanitization: filter out any orphaned/deleted products
    const validItems = cart.items.filter((item) => item.product && item.product._id);
    if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        await cart.save();
    }

    if (validItems.length === 0) {
        throw new ApiError(400, "Your cart is empty or the selected products are no longer available");
    }

    const { shippingAddress, paymentMethod } = req.body;

    const orderItems = validItems.map((item) => ({
        product: item.product._id,
        name: item.product.title,
        image: item.product.images?.[0]?.url || item.product.images?.[0] || "",
        price: (item.product.discountPrice && item.product.discountPrice > 0 && item.product.discountPrice < item.product.price)
            ? item.product.discountPrice
            : item.product.price,
        quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        totalAmount,
        shippingAddress: shippingAddress || null,
        paymentMethod: paymentMethod || "CARD",
        orderStatus: "Pending",
    });

    cart.items = [];
    await cart.save();

    await order.populate("user", "fullName username email phone address city state postalCode");

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
    })
        .populate("user", "fullName username email phone")
        .populate("items.product", "title images price brand stock")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );
});

export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate("user", "fullName username email phone address city state postalCode")
        .populate("items.product", "title images price brand stock")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "All orders fetched successfully"
        )
    );
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, orderStatus } = req.body;
    const targetStatus = status || orderStatus;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!targetStatus || !validStatuses.includes(targetStatus)) {
        throw new ApiError(
            400,
            `Invalid order status. Allowed statuses: ${validStatuses.join(", ")}`
        );
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.orderStatus = targetStatus;
    await order.save();

    await order.populate("user", "fullName username email phone address city state postalCode");
    await order.populate("items.product", "title images price brand stock");

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            `Order status updated to ${targetStatus} successfully`
        )
    );
});

export const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
        .populate("user", "fullName username email phone address city state postalCode")
        .populate("items.product", "title images price brand stock");

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