import express from 'express';
import mongoose from 'mongoose';
import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from './db';
import { JWT_SECRET } from './config';
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
        password:z.string().max(50).min(4),
        username:z.string().max(25)
    })
    const parsedatasuccess=requirebody.safeParse(req.body)
    if(!parsedatasuccess){
        res.status(411).json({
            msg:"Incorrect format "
        })  
    }
    
    const username=req.body.username
    const password=req.body.password
    const salt =await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt)
try{
    await UserModel.create({
        username:username,
        password:hashedpassword

    })}
catch(e){
    res.status(411).json({
        msg:"User already exist "
    })
}
console.log(req.body)
   res.json({
    msg:"YOU are signed up "

   }) }
   
   

)
app.post("/api/v1/signin",async (req,res)=>{
  const {username,password}=req.body;
  try{
    if(!username || !password){
    res.status(400).json("Username and password are required")
    return;
    }
    const existinguser=await UserModel.findOne({username});
    if(!existinguser){
      res.status(403).json({
        msg:"User not found"
      
      })
    return;}
      
      const ispasswordcorrect=await bcrypt.compare(password,existinguser.password ||'')
      if(!ispasswordcorrect){
        res.status(400).json({
          msg:"Incorrect password"
        })
      return;
      }
      const token=jwt.sign({
        id:existinguser._id
      }, JWT_SECRET)
      res.json({
        token
      })
    
  }
  catch(e){
    res.status(500).json({
      msg:"Error sigining in "
    })

  }
})
  
app.post("/api/v1/content" , (req,res)=>{

})
app.get("/api/v1/content", (req,res)=>{

})
app.delete("/api/v1/content", (req,res)=>{
     
})
app.get("/", (req, res) => {
    res.send("Server running ✅");
  });
  
app.listen(3000);