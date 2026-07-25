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
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

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
        $regex: search,
        $options: "i",
        };
    }
    if (category) {
    filter.category = category;
    }
    if (brand) {
    filter.brand = brand;
    }
    if (featured) {
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
            sortOption = { price: 1 };
            break;

        case "-price":
            sortOption = { price: -1 };
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

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);
  return res.status(200).json(
    new ApiResponse(
        200,
        {
            products,
            totalProducts,
            totalPages,
            currentPage: page,
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