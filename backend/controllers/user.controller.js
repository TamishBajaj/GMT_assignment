import asyncHandler  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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


export default registerUser