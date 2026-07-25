import { body } from "express-validator";

const createProductValidator = () => {
  return [
    body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

    body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("discountPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Discount price must be a positive number"),

    body("category")
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid category id"),
    
    body("brand")
      .trim()
      .notEmpty()
      .withMessage("Brand is required"),

    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock cannot be negative"),
  ];
};

export { createProductValidator };