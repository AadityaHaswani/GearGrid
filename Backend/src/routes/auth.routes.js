import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  login,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgotPassword,
  verifyEmail,
} from "../controllers/auth.controllers..js";
import {
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const authRouter = Router()
authRouter.post("/register",userRegisterValidator(),validate,registerUser)


authRouter.post("/login",userLoginValidator(),validate,login )
authRouter.route("/verify-email/:verificationToken").get(verifyEmail);
authRouter.route("/refresh-token").post(refreshAccessToken);
authRouter
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
authRouter
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

authRouter.post("/logout",verifyJWT,logoutUser )

authRouter.route("/current-user").post(verifyJWT, getCurrentUser);
authRouter
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );
authRouter
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);



export default authRouter