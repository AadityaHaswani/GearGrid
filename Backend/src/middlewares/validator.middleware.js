import { validationResult } from "express-validator";
import fs from "fs";
import { ApiError } from "../utils/ApiErrors.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Clean up temporary uploaded file if validation failed
        if (req.file?.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupErr) {
                console.error("Failed to delete temp file:", cleanupErr);
            }
        }

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