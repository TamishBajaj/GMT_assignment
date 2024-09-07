import mongoose, {Schema} from "mongoose"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true,   // We do this for efficient searching
        },
        email:{
            type: String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
        },
        fullname:{
            type: String,
            required:true,
            trim:true,
            index:true,   // We do this for efficient searching
        },
        avatar:{
            type:String, // cloudinary URL
            required:true,
        },
        coverImage:{
            type:String, // cloudinary URL
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,   // jab bhi kissi aur schema ko reference karna ho
                ref:"Video"   
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String
        }

    },
    {
        timestamps:true   // From here we get created at and updated at
    }

)


// Is function ka simple sa matlab hai password save karne se pehle usse hash kardo
userSchema.pre("save", async function(next){   // it has to be async because in kamo mei time toh lagta hai

    if(!this.isModified("password")) return next();  // Har bar thodi hash karte rahege jab kuch change ayega sirf tabhi

    this.password=await bcrypt.hash(this.password,10);
    next() // As this is like a middleware so we need to call our flag at the end
} )

// Khudse defined wale method goes here

userSchema.methods.isPasswordCorrect=async function(password) {
    
    return await bcrypt.compare(password,this.password);
}


userSchema.methods.generateAcessToken=function(){
    return jwt.sign(
    {// payload
        _id:this._id,
        username:this.username,
        fullname:this.fullname,
        email:this.email

    },
    process.env.ACCESS_TOKEN_KEY,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    }
)
}

userSchema.methods.generateRefreshToken=function(){

    return jwt.sign(
        {// payload
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
    
}


export const User=mongoose.model("User",userSchema)