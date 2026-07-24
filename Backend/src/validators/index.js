import { body } from "express-validator";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";


const userRegisterValidator = () =>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Emain is invalid"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username Cant be empty"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cant be empty")
        .isLength({min:8})
        .withMessage("Password should be of atleast 8 characters"),
        body("fullName")
        .optional()
        .trim()
        .notEmpty(),
    ]
     
}
const userLoginValidator = ()=>{
    return [body("email")
        .optional()
        .isEmail()
        .withMessage("Email is Invalid"),
        body("password")
        .notEmpty()
        .withMessage("Password Cant Be empty")
        .isLength({min:8})
        .withMessage("Password Must be 8-chracter long")
    ]
}


const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name")
    .notEmpty()
    .withMessage("Name is required"),
    body("description")
    .optional(),
  ];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};



export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
  
};
