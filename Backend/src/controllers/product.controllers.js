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
    const products = await Product.find()
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            products,
            "Products fetched successfully"
        )
    );
});

export { 
    createProduct,
    getAllProducts

};