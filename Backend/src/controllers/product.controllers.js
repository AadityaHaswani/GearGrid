import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        price,
        discountPrice,
        category,
        brand,
        stock,
        featured,
    } = req.body;

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
        throw new ApiError(404, "Category not found");
    }

    const product = await Product.create({
        title,
        description,
        price,
        discountPrice,
        category,
        brand,
        stock,
        featured,
        createdBy: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 100);
    const skip = (page - 1) * limit;

    const { 
        search,
        category,
        brand,
        sort,
        featured,
        minPrice,
        maxPrice
    } = req.query;

    const filter = {};

    if (search) {
        filter.title = {
            $regex: search.trim(),
            $options: "i",
        };
    }

    if (category) {
        if (mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
        } else {
            const foundCategory = await Category.findOne({
                $or: [
                    { slug: category.toLowerCase() },
                    { name: { $regex: new RegExp(`^${category}$`, "i") } }
                ]
            }).select("_id").lean();

            if (foundCategory) {
                filter.category = foundCategory._id;
            } else {
                filter.category = null;
            }
        }
    }

    if (brand) {
        filter.brand = { $regex: new RegExp(`^${brand.trim()}$`, "i") };
    }

    if (featured !== undefined) {
        filter.featured = featured === "true";
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    let sortOption = { createdAt: -1 };

    if (sort) {
        switch (sort) {
            case "price":
            case "price-low":
                sortOption = { price: 1 };
                break;

            case "-price":
            case "price-high":
                sortOption = { price: -1 };
                break;

            case "rating":
                sortOption = { rating: -1 };
                break;

            case "latest":
                sortOption = { createdAt: -1 };
                break;

            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            default:
                sortOption = { createdAt: -1 };
        }
    }

    // Execute count and selective projection find query concurrently
    const [totalProducts, products] = await Promise.all([
        Product.countDocuments(filter),
        Product.find(filter)
            .select("_id title price discountPrice brand stock rating numReviews images category featured createdAt")
            .populate("category", "name slug")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean()
    ]);

    const totalPages = Math.ceil(totalProducts / limit) || 1;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit,
                },
                totalProducts,
                totalPages,
                currentPage: page,
                limit,
            },
            "Products fetched successfully"
        )
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId)
        .populate("category", "name slug");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product fetched successfully"
        )
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const {
        title,
        description,
        price,
        discountPrice,
        category,
        brand,
        stock,
        featured,
    } = req.body;

    if (category) {
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            throw new ApiError(404, "Category not found");
        }
    }

    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.stock = stock ?? product.stock;
    product.featured = featured ?? product.featured;

    await product.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product updated successfully"
        )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await product.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Product deleted successfully"
        )
    );
});

export { 
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct

};