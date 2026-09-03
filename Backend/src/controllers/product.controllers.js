import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

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

    let categoryDoc = null;
    if (mongoose.Types.ObjectId.isValid(category)) {
        categoryDoc = await Category.findById(category);
    } else {
        categoryDoc = await Category.findOne({
            $or: [
                { slug: String(category).toLowerCase() },
                { name: { $regex: new RegExp(`^${category}$`, "i") } }
            ]
        });
    }

    if (!categoryDoc) {
        throw new ApiError(404, "Category not found");
    }

    const images = [];

    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path, "geargrid/products");
        if (uploadResult?.secure_url) {
            images.push({
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            });
        }
    } else if (req.body.image || req.body.imageUrl) {
        images.push({
            url: req.body.image || req.body.imageUrl,
            publicId: `external_${Date.now()}`,
        });
    } else {
        images.push({
            url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
            publicId: "default_hardware",
        });
    }

    const product = await Product.create({
        title: title.trim(),
        description: description?.trim() || `High performance enthusiast ${title.trim()} hardware component.`,
        price: Number(price),
        discountPrice: discountPrice && !isNaN(Number(discountPrice)) ? Number(discountPrice) : 0,
        category: categoryDoc._id,
        brand: (brand && brand.trim()) || "GearGrid Lab",
        stock: stock !== undefined && !isNaN(Number(stock)) ? Number(stock) : 0,
        featured: featured === true || featured === "true",
        images,
        createdBy: req.user?._id,
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

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID format");
    }

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
        let categoryDoc = null;
        if (mongoose.Types.ObjectId.isValid(category)) {
            categoryDoc = await Category.findById(category);
        } else {
            categoryDoc = await Category.findOne({
                $or: [
                    { slug: String(category).toLowerCase() },
                    { name: { $regex: new RegExp(`^${category}$`, "i") } }
                ]
            });
        }

        if (!categoryDoc) {
            throw new ApiError(404, "Category not found");
        }
        product.category = categoryDoc._id;
    }

    // Handle new image upload if provided
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path, "geargrid/products");
        if (uploadResult?.secure_url) {
            // Safely delete previous Cloudinary asset if it belongs to geargrid folder
            const oldPublicId = product.images?.[0]?.publicId;
            if (oldPublicId && oldPublicId.startsWith("geargrid/")) {
                await deleteFromCloudinary(oldPublicId);
            }

            product.images = [
                {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                },
            ];
        }
    } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
        // External image URL replacement if supplied as string
        product.images = [
            {
                url: req.body.image,
                publicId: `external_${Date.now()}`,
            },
        ];
    }

    if (title !== undefined && title.trim()) product.title = title.trim();
    if (description !== undefined && description.trim()) product.description = description.trim();
    if (price !== undefined && price !== "" && !isNaN(Number(price))) product.price = Number(price);
    if (discountPrice !== undefined && discountPrice !== "" && !isNaN(Number(discountPrice))) product.discountPrice = Number(discountPrice);
    if (brand !== undefined && brand.trim()) product.brand = brand.trim();
    if (stock !== undefined && stock !== "" && !isNaN(Number(stock))) product.stock = Number(stock);
    if (featured !== undefined) product.featured = featured === true || featured === "true";

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

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID format");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Safely delete Cloudinary asset if it was stored in geargrid folder
    const oldPublicId = product.images?.[0]?.publicId;
    if (oldPublicId && oldPublicId.startsWith("geargrid/")) {
        await deleteFromCloudinary(oldPublicId);
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