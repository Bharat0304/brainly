import express from 'express';
import mongoose from 'mongoose';
import z from "zod";
import bcrypt from "bcrypt";
import { UserSchema } from './db';
const app=express();
app.use(express.json());
 async function abc(){
 await mongoose.connect("mongodb+srv://kbharat84265:SjgpL1UbSskmfFBO@cluster0.tfyruuc.mongodb.net/brainlydb")
}
abc()
    console.log("Mongodb is connected ")

app.post("/api/v1/signup", async(req,res)=>{
    const requirebody=z.object({
        email:z.string().email().min(5).max(100),
        password:z.string().email().max(50).min(4)
    })
    const parsedatasuccess=requirebody.safeParse(req.body)
    if(!parsedatasuccess){
        res.status(411).json({
            msg:"Incorrect format "
        })
    }
    
    const username=req.body.username
    const password=req.body.password
    const hashedpassword=await bcrypt.hash(password,5)
try{
    await UserSchema.create({
        username:username,
        password:hashedpassword

    })}
catch(e){
    res.status(411).json({
        msg:"User already exist "
    })
}

   res.json({
    msg:"YOU are signed up "
   }) }

)
app.post("/api/v1/signin", async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
     const user=await UserSchema.findOne({
        username:username
        
     })
    if(!user){
         res.status(411).json({
            msg:"Invalid credintials "
        })
    }
    const correcthash= await bcrypt.compare(password,password)

    

})
app.post("api/v1/content" , (req,res)=>{

})
app.get("api/v1/content", (req,res)=>{

})
app.delete("api/v1/content", (req,res)=>{
     
})
app.listen(3000);