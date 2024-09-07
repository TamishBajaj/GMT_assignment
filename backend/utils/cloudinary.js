import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
});



const uploadOnCloudinary=async (localFilePath) => {

    try {

        if(!localFilePath) return null;

        // LEts upload it to cloudinary

       const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //file is uploaded sucessfully
        // console.log("File is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        fs.unlinkSync(localFilePath)  // remove the temporarly stored local file as upload got failed
        return null
        
    }
}


export {uploadOnCloudinary}