import { User } from "../models/users.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mails.js"
import { log } from "console";


import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken =user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}

        } catch (error) {
            throw error
            console.log(error);
             ApiError(
                500,
                "Something Went Wrong"
            )
        
    }

}



const registerUser = asyncHandler(async(req,res)=>{
    const {email,password,username,role}= req.body
    const existedUser = await User.findOne({
        $or : [{username},{email}]
    })
    console.log(existedUser);
    
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists",[])
    }
const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false
 }) 
const {unhasehdToken,hashedToken,tokenExpiry} =  user.generateTemporaryTokens()
user.emailVerificationToken = hashedToken
user.emailVerificationExpiry = tokenExpiry
await user.save({validateBeforeSave:false})


await sendEmail({
    email: user?.email,
    subject: "Please Verify Your Mail",
    mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhasehdToken}`
    )

})
const userCreated = await User.findById(user._id)
    

if (!userCreated) {
    throw new ApiError(500,"Something Went User While Registering User")
}
return res.status(201).json(
    new ApiResponse(200,
        {user:userCreated},
        "User Registered Succesfully And Verfication is mail on your sent"
    )
)

})
const login = asyncHandler(async(req,res)=>{
    const {email,password,username}= req.body
    if ( !email) {
        throw new ApiError(400,"Email is required")
    }

  const user =  await User.findOne({email})
    if (!user) {
        throw new ApiError(400,"User Does Not Exist!!!")
    }
   const isPasswordValid= await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
    throw new ApiError(400,"Invalid password")
   }
  const{accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  )
  const options = {
    httpOnly:true,
    secure : true
  }
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
        200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        },
        "User loggen in succesfully"
    )
  )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:""
            }
        },
        {
            new:true
        },
    )
    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out")
    )

})
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current User fetched successfully"
        ) 
    )

})

const verifyEmail = asyncHandler(async(req,res)=>{
    const {verificationToken}=req.params
    if (!verificationToken) {
        throw new ApiError(
            400,"Email verification token is missing "
        )
    }
    let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex")
    
    const user =await User.findOne({
        emailVerificationToken:hashedToken,
        emailVerificationExpiry:{$gt:Date.now()}
    })
    if (!user) {
        throw new ApiError(
            400,"Token is Invalid Or Expired"
        )
        
    }
    user.emailVerificationToken = undefined
    user.emailVerificationExpiry = undefined


    user.isEmailVerified = true
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                isEmailVerified:true
            },
            "Email Is Verfied"
        )
    

    ) 

})

const resendEmailVerification = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404,"User Does not Exist")
    }
    if (user.isEmailVerified) {
        throw new ApiError(409,"Email Already Verified")
    }
const {unhasehdToken,hashedToken,tokenExpiry} =  user.generateTemporaryTokens()
user.emailVerificationToken = hashedToken
user.emailVerificationExpiry = tokenExpiry
await user.save({validateBeforeSave:false})


await sendEmail({
    email: user?.email,
    subject: "Please Verify Your Mail",
    mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhasehdToken}`
    )

})
return res
.status(200)
.json(
    new ApiResponse(
        200,
        {},
        "Mail has been sent to your email ID"
    )
)

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401 , "Unauthorized Access")
    }
    try {
       const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
       const user = await User.findById(decodedToken?._id)
       if (!user) {
        throw new ApiError(401,"Invalid Refresh Token")
       }
       if (incomingRefreshToken!==user?.refreshToken) {
        throw new ApiError(401,"Refresh Token is expired")
       }
       const option ={
        httpOnly:true,
        secure:true
       }
     const{ accessToken,refreshToken:newRefreshToken} =   await generateAccessAndRefreshToken(user._id)
     user.refreshToken = newRefreshToken
     await user.save()

     return res
     .status(200)
     .cookie("accessToken",accessToken)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "Access Token Refreshed"
        )
     )


    } catch (error) {
        throw new ApiError(401,"Invalid refresh token")
    }
})

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists", []);
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your mail id",
      ),
    );
});

const resetForgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, "Token is invalid or expired");
  }

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

 


export {registerUser,login,logoutUser,getCurrentUser,verifyEmail,resendEmailVerification,refreshAccessToken,forgotPasswordRequest,resetForgotPassword,changeCurrentPassword}
;
