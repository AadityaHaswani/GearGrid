import { Category } from "../models/category.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import slugify from "slugify";

const createCategory = asyncHandler(async (req, res) => {
    const { name,  description } = req.body;
    const slug = slugify(name, {
    lower: true,
    strict: true,
    });

    const categoryExists = await Category.findOne({
        $or: [{ name }, { slug }],
    });

    if (categoryExists) {
        throw new ApiError(409, "Category already exists");
    }

    const category = await Category.create({
        name,
        slug,
        description,
    });

    return res.status(201).json(
        new ApiResponse(201, category, "Category created successfully")
    );
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully"
        )
    );
});

export {
    createCategory,
    getAllCategories,
};

