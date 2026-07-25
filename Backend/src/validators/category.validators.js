import { body } from "express-validator";

const createCategoryValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Category name is required"),

       
    ];
};

export { createCategoryValidator };