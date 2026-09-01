import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { sendVerificationOtp, sendPasswordResetOtp } from "../utils/mails.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(String(otp).trim()).digest("hex");
};

/**
 * Register User & Send Verification OTP
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  const { rawOtp, hashedOtp, expiry } = user.generateOtp();
  user.emailVerificationOtp = hashedOtp;
  user.emailVerificationExpiry = expiry;
  user.lastOtpSentAt = new Date();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationOtp(user.email, rawOtp);
  } catch (mailError) {
    console.error("Failed to send verification email:", mailError.message);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        email: user.email,
        username: user.username,
        isEmailVerified: false,
      },
      "User registered successfully. A 6-digit verification OTP has been sent to your email."
    )
  );
});

/**
 * Verify Email using 6-digit OTP
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and 6-digit OTP are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  if (user.isEmailVerified) {
    return res.status(200).json(
      new ApiResponse(200, { isEmailVerified: true }, "Email is already verified")
    );
  }

  const hashedIncomingOtp = hashOtp(otp);

  if (
    !user.emailVerificationOtp ||
    user.emailVerificationOtp !== hashedIncomingOtp ||
    !user.emailVerificationExpiry ||
    new Date(user.emailVerificationExpiry).getTime() < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired verification OTP");
  }

  user.isEmailVerified = true;
  user.emailVerificationOtp = undefined;
  user.emailVerificationExpiry = undefined;

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationOtp -emailVerificationExpiry -forgotPasswordOtp -forgotPasswordExpiry"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
          isEmailVerified: true,
        },
        "Email verified successfully"
      )
    );
});

/**
 * Resend Email Verification OTP
 */
const resendEmailVerification = asyncHandler(async (req, res) => {
  const email = req.body.email || req.user?.email;

  if (!email) {
    throw new ApiError(400, "Email is required to resend verification OTP");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  if (user.lastOtpSentAt) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(user.lastOtpSentAt).getTime()) / 1000);
    if (elapsedSeconds < 60) {
      throw new ApiError(
        429,
        `Please wait ${60 - elapsedSeconds} seconds before requesting a new OTP.`
      );
    }
  }

  const { rawOtp, hashedOtp, expiry } = user.generateOtp();
  user.emailVerificationOtp = hashedOtp;
  user.emailVerificationExpiry = expiry;
  user.lastOtpSentAt = new Date();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationOtp(user.email, rawOtp);
  } catch (mailError) {
    console.error("Failed to resend verification email:", mailError.message);
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Verification OTP has been resent to your email.")
  );
});

/**
 * User Login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationOtp -emailVerificationExpiry -forgotPasswordOtp -forgotPasswordExpiry"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

/**
 * User Logout
 */
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

/**
 * Get Current Authenticated User
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched successfully")
  );
});

/**
 * Refresh Access Token
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access: Refresh token missing");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

/**
 * Forgot Password: Send 6-digit Reset OTP
 */
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(404, "User does not exist with this email");
  }

  if (user.lastOtpSentAt) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(user.lastOtpSentAt).getTime()) / 1000);
    if (elapsedSeconds < 60) {
      throw new ApiError(
        429,
        `Please wait ${60 - elapsedSeconds} seconds before requesting a new password reset OTP.`
      );
    }
  }

  const { rawOtp, hashedOtp, expiry } = user.generateOtp();
  user.forgotPasswordOtp = hashedOtp;
  user.forgotPasswordExpiry = expiry;
  user.lastOtpSentAt = new Date();
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetOtp(user.email, rawOtp);
  } catch (mailError) {
    console.error("Failed to send password reset email:", mailError.message);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { email: user.email },
      "Password reset OTP has been sent to your email."
    )
  );
});

/**
 * Verify Password Reset 6-digit OTP
 */
const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and 6-digit OTP are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const hashedIncomingOtp = hashOtp(otp);

  if (
    !user.forgotPasswordOtp ||
    user.forgotPasswordOtp !== hashedIncomingOtp ||
    !user.forgotPasswordExpiry ||
    new Date(user.forgotPasswordExpiry).getTime() < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired password reset OTP");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { email: user.email, verified: true },
      "Password reset OTP verified successfully."
    )
  );
});

/**
 * Reset Password with Verified OTP
 */
const resetForgotPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP, and new password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const hashedIncomingOtp = hashOtp(otp);

  if (
    !user.forgotPasswordOtp ||
    user.forgotPasswordOtp !== hashedIncomingOtp ||
    !user.forgotPasswordExpiry ||
    new Date(user.forgotPasswordExpiry).getTime() < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired password reset OTP");
  }

  user.forgotPasswordOtp = undefined;
  user.forgotPasswordExpiry = undefined;
  user.password = newPassword;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Password reset successfully. You can now sign in with your new password.")
  );
});

/**
 * Change Password for Authenticated User
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully")
  );
});

export {
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
};
