import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/product.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { createProductValidator } from "../validators/product.validators.js";
import { validate } from "../middlewares/validator.middleware.js";


const router = Router();

router.route("/")
    .get(getAllProducts)
    .post(
        verifyJWT,
        isAdmin,
        createProductValidator(),
        validate,
        createProduct
    );



router.route("/:productId")
    .get(getProductById)
    .put(
        verifyJWT,
        isAdmin,
        updateProduct
    )
    .delete(
        verifyJWT,
        isAdmin,
        deleteProduct
    );

export default router;