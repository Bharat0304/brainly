import { model,Schema } from "mongoose";
const Usermodel=new Schema({
    username:{type:String,unique:true},

    password:{type:String, 
    require:true}

})
export const UserSchema= model("User",Usermodel)
