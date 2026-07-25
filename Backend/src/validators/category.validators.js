import { body } from "express-validator";

const createCategoryValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Category name is required"),

        body("slug")
            .trim()
            .notEmpty()
            .withMessage("Category slug is required"),
    ];
};

export { createCategoryValidator };