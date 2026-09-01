import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  resendEmailVerification,
  login,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  forgotPasswordRequest,
  verifyResetOtp,
  resetForgotPassword,
  changeCurrentPassword,
} from "../controllers/auth.controllers..js";
import {
  userRegisterValidator,
  userLoginValidator,
  userVerifyEmailOtpValidator,
  userResendOtpValidator,
  userForgotPasswordValidator,
  userVerifyResetOtpValidator,
  userResetForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

// Registration & Email Verification (OTP)
authRouter.post("/register", userRegisterValidator(), validate, registerUser);
authRouter.post("/verify-email-otp", userVerifyEmailOtpValidator(), validate, verifyEmail);
authRouter.post("/verify-otp", userVerifyEmailOtpValidator(), validate, verifyEmail);
authRouter.post("/resend-email-verification", userResendOtpValidator(), validate, resendEmailVerification);
authRouter.post("/resend-otp", userResendOtpValidator(), validate, resendEmailVerification);

// Authentication
authRouter.post("/login", userLoginValidator(), validate, login);
authRouter.post("/logout", verifyJWT, logoutUser);
authRouter.post("/current-user", verifyJWT, getCurrentUser);
authRouter.post("/refresh-token", refreshAccessToken);

// Forgot Password & Reset (OTP)
authRouter.post("/forgot-password", userForgotPasswordValidator(), validate, forgotPasswordRequest);
authRouter.post("/verify-reset-otp", userVerifyResetOtpValidator(), validate, verifyResetOtp);
authRouter.post("/reset-password", userResetForgotPasswordValidator(), validate, resetForgotPassword);

// Change Password
authRouter.post(
  "/change-password",
  verifyJWT,
  userChangeCurrentPasswordValidator(),
  validate,
  changeCurrentPassword
);

export default authRouter;