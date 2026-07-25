import { Router } from "express";
import {
    createProduct,
    getAllProducts,
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

export default router;