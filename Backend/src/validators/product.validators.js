import { body } from "express-validator";

const createProductValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Product title is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("discountPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Discount price must be a positive number"),

    body("category")
      .notEmpty()
      .withMessage("Category is required"),

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