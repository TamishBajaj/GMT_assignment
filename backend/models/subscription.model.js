import mongoose ,{Schema} from 'mongoose'

const subscriptionSchema=new Schema({

    subscriber:{
        type:Schema.Types.ObjectId, // subscriber bhi user hai
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId, // jiska channel hai wo bhi user hai
        ref:"User"

    }


},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptionSchema)