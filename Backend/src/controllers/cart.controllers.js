import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    let cart = await Cart.findOne({
        user: req.user._id,
    });
    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [],
        });
    }
    const existingItem = cart.items.find((item) =>
        item.product.equals(productId),
    );
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            product: productId,
            quantity: 1,
        });
    }
    await cart.save();
    await cart.populate({
        path: "items.product",
        select: "title price images brand rating stock",
    });
    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Product added to cart successfully"));
});
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({
        user: req.user._id,
    }).populate({
        path: "items.product",
        select: "title price images brand rating stock",
    });

    if (!cart) {
        cart = {
            user: req.user._id,
            items: [],
        };
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});
const updateCartQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { action } = req.body;

    let cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const cartItem = cart.items.find((item) => item.product.equals(productId));

    if (!cartItem) {
        throw new ApiError(404, "Product not found in cart");
    }
    if (action === "increase") {
        cartItem.quantity += 1;
    } else if (action === "decrease") {
        if (cartItem.quantity === 1) {
            cart.items = cart.items.filter((item) => !item.product.equals(productId));
        } else {
            cartItem.quantity -= 1;
        }
    } else {
        throw new ApiError(400, "Action must be either 'increase' or 'decrease'");
    }
    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "title price images brand rating stock",
    });

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart updated successfully"));
});
const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const cartItem = cart.items.find(
        (item) => item.product.equals(productId)
    );

    if (!cartItem) {
        throw new ApiError(404, "Product not found in cart");
    }

    cart.items = cart.items.filter(
        (item) => !item.product.equals(productId)
    );

    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "title price images brand rating stock",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Product removed from cart successfully"
        )
    );
});

const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart cleared successfully"
        )
    );
});
export {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
};