import mongoose from "mongoose";
import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const isProductMatch = (itemProduct, targetId) => {
    if (!itemProduct || !targetId) return false;
    if (typeof itemProduct.equals === "function") {
        return itemProduct.equals(targetId);
    }
    const rawId = itemProduct._id || itemProduct;
    return String(rawId) === String(targetId);
};

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID format");
    }

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

    // Clean existing items of any null/undefined product references
    cart.items = cart.items.filter((item) => item.product);

    const existingItem = cart.items.find((item) => isProductMatch(item.product, productId));

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
        select: "title price discountPrice images brand rating stock",
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
        select: "title price discountPrice images brand rating stock",
    });

    if (!cart) {
        cart = {
            user: req.user._id,
            items: [],
        };
    } else {
        // Self-healing sanitization: prune any orphaned/deleted products from MongoDB
        const validItems = cart.items.filter((item) => item.product && item.product._id);
        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const updateCartQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { action } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID format");
    }

    let cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter((item) => item.product);

    const cartItem = cart.items.find((item) => isProductMatch(item.product, productId));

    if (!cartItem) {
        throw new ApiError(404, "Product not found in cart");
    }

    if (action === "increase") {
        cartItem.quantity += 1;
    } else if (action === "decrease") {
        if (cartItem.quantity <= 1) {
            cart.items = cart.items.filter((item) => !isProductMatch(item.product, productId));
        } else {
            cartItem.quantity -= 1;
        }
    } else {
        throw new ApiError(400, "Action must be either 'increase' or 'decrease'");
    }

    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "title price discountPrice images brand rating stock",
    });

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID format");
    }

    let cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.product && !isProductMatch(item.product, productId));

    if (cart.items.length === initialLength) {
        throw new ApiError(404, "Product not found in cart");
    }

    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "title price discountPrice images brand rating stock",
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