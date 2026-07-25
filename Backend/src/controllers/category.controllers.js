import { Category } from "../models/category.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, description } = req.body;

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

export { createCategory };