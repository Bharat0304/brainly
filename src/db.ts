import mongoose, { model,Schema } from "mongoose";
const UserSchema=new Schema({
    username:{type:String,unique:true,required:true},

    password:{type:String, 
    required:true},

    email:{type:String}

})
const ContentSchema=new Schema({
    title:String,
    content:String,
    link:String,
    tag:[String],
    Userid:{type:mongoose.Types.ObjectId,ref:"User",require:true},
    type:String
})
export const UserModel= model("User",UserSchema)
export const ContentModel=model("Content",ContentSchema)