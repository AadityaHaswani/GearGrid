import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiErrors.js";


export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));

        throw new ApiError(
            422,
            "Validation failed",
            formattedErrors
        );
    }

    next();
};