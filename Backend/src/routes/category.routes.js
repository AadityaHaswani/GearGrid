import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createCategoryValidator } from "../validators/category.validators.js";
import { createCategory } from "../controllers/category.controllers.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    isAdmin,
    createCategoryValidator(),
    validate,
    createCategory
);

export default router;