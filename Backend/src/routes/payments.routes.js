import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPayment } from "../controllers/payments.controllers.js";
import { createPaymentValidator } from "../validators/payments.validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();
router.use(verifyJWT);

router.post(
    "/",
    createPaymentValidator,
    validate,
    createPayment
);

export default router;