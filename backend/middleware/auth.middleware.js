import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();

export const verifyJWT= asyncHandler(async(req,res,next) =>{
    // req.header() wala kaam mobile applications ke liye
    try {
       
        const token=req.cookies?.acessToken || req.header("Authorization")?.replace("Bearer ","");
        
        if(!token){
            throw new ApiError(401,"Unauthorized request");
        }
    
        // IF token is there need to confirm from JWT is it correct
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
        
        const user=await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
    
        if(!user){
            throw new ApiError(401,"Invalid Acess Token")
        }
    
    
        req.user=user;
        next();
    } catch (error) {
        
        throw new ApiError(401,error?.message || "Invalid Acess TOken")
    }

})