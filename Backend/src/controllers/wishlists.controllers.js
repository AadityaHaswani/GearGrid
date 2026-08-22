import { Wishlist } from "../models/wishlists.models.js";
import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let wishlist = await Wishlist.findOne({
        user: req.user._id,
    });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId],
        });
    } else {
        wishlist.products.addToSet(productId);
        await wishlist.save();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            wishlist,
            "Product added to wishlist"
        )
    );
});

export const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({
        user: req.user._id,
    }).populate(
        "products",
        "title price discountPrice brand stock rating images"
    );

    if (!wishlist) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { products: [] },
                "Wishlist fetched successfully"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            wishlist,
            "Wishlist fetched successfully"
        )
    );
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
        user: req.user._id,
    });

    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    wishlist.products.pull(productId);

    await wishlist.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            wishlist,
            "Product removed from wishlist"
        )
    );
});