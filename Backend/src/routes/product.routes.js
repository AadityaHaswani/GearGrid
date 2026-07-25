import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct } from "../controllers/product.controllers.js";
import { createProductValidator } from "../validators/product.validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    isAdmin,
    createProductValidator(),
    validate,
    createProduct
);

export default router;