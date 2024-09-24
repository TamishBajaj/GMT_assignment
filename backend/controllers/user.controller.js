import {asyncHandler}  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAcessAndRefreshToken=async(userId)=>{

    try {

        const user=await User.findById(userId)

        const acessToken=user.generateAcessToken()
        const refreshToken=user.generateRefreshToken()
        
        // Kuki i want refresh token to be stored in my database
        // Becoz its a long interval token
        user.refreshToken=refreshToken
        await user.save({ validateBeforeSave: false })

        return {acessToken,refreshToken}

    } catch (error) {
        
        throw new ApiError(500,"Something went wrong during generating acess Token")
    }

}




const registerUser=asyncHandler(async(req,res)=>{

   //get user details from frontend
   //validation-not empty
   //CHeck if email,username already exist or not
   //check for images, avatar
   //upload them to cloudinary
   //create a user object- To create entry in db
   //remove password and refresh token from response
   //check for user creation wheterr its created or not
   //return res



   //--> If data is coming from a form or json then req.body() is sufficient
   // --->  But if it comes from URL then we will see how to fetch it

   const {username,email,fullname,password}=req.body;


   // This checks in one statement if its empty or not
   if(
    [fullname,username,email,password].some((field)=>
        field?.trim() === "")
    // Even if one field is empty it will return true
   ){

    throw new ApiError(400,"All feilds are compulsory")

   }

   // Lets check if user exists
   // $ lagao pata lagega kitne options hai
   const existedUser=await User.findOne({

    $or: [{ username },{ email }] // It check for both username and email
   })

   if(existedUser){
    throw new ApiError(409, "User already Exists")
   }

   // Lets see how to acess files

   const avatarLocalPath = req.files?.avatar[0]?.path;  // taking it optionally
//    const coverImageLocalPath = req.files?.coverImage[0]?.path;  Issue ye hai ki agar field empty hai toh wo undefined ajara hai

let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

   
   if(!avatarLocalPath){
    console.error("Avatar file not found:", req.files.avatar);
    throw new ApiError(400, "Avatar is required");
   }


    // Log before attempting to upload to Cloudinary
console.log("Uploading avatar to Cloudinary:", avatarLocalPath);

   // Lets upload it on cloudinary
   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    console.error("Failed to upload avatar to Cloudinary");
  throw new ApiError(400, "Avatar upload failed");
   }


   const user=User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })


   const createdUser=User.findById(user._id).select(
    "-password -refreshToken"   // THis tells ye wali nahi leni feilds
   )

   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
   }

   return res.status(200).json(
    new ApiResponse(200,createdUser,"User Registered Sucessfully")
   )

})


const loginUser=asyncHandler(async(req,res) => {
    //req body se data leaao
    // Check whether any field is empty or not
    // Check whether the email or username exists or not
    // Compare the password is valid or not for that email
    // after this generate acess token and refresh token and return it to user
    // Send these token in cookies
    // If everything goes well login the user 

    const {email,username,password}=req.body;

    if(!email && !username){
        return new ApiError(400,"Username or email is required")
    }

    // Ya toh username dia ho ya email dia kuch bhi chalega
    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User doesnot Exists")
    }


    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect")
    }

    // Generate tokens toh ye method humne yahi upar banaya hai top pe

    const {acessToken,refreshToken}=await generateAcessAndRefreshToken(user._id);

    // Is mei passowrd aur refreshTOekn ke alawa sab hoga
    const loggedInUser=await User.findById(user._id)
    .select("-password -refreshToken")

    // Lets send the cookies

    const options={
        httpOnly:true, // AGar ye nahi likhte toh frontend se
        secure:true, // Koi bhi cookie change karskta ab sirf server wo kaam karpayega  
        
    }

    return res
    .status(200)
    .cookie("acessToken",acessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,acessToken,refreshToken
            },
            "User Logged in Sucessfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res) => {

    // FIRST PROBLEM
    // Upar hum log const user=User.findOne se user nikal lerahe the
    // Yahan kaise nikale bhaai, aisa thodi karege email do fir logout karege
    

    // KUKI MAINE EK MIDDLEWARE JUST ISSE PEHLE RUN KARWYA
    // NOW I HAVE ACESS TO USER

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )


    const options={
        httpOnly:true, 
        secure:true 
    }

    return res.status(200)
    .clearCookie("acessToken",options) // Iske karke hogya ab logout
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user Logged out succesfully"))
    
    
})


// This we are making for the frontend, so that bar bar login na 
// karna pade
const refreshAcessToken=asyncHandler(async(req,res)=>{

        // req.body wala likha hai for mobile users
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request");
    }

    try {
        // Verify token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        //If you go and see we generated refereshToken and sent an _id with it
        const user=await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh Token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const {newRefreshToken,acessToken}=await generateAcessAndRefreshToken(user._id);
    
        return res
        .status(200)
        .cookie("acessToken",acessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    acessToken,refreshToken:newRefreshToken,
                },
                "Acess Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh token")
    }
})


export {registerUser,loginUser,logoutUser,refreshAcessToken}