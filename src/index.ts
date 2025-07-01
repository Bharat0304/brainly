import express from 'express';
import cors from "cors";
import{randomhash} from './utils'
import mongoose from 'mongoose';
import z, { boolean, literal } from "zod";
import bcrypt, { hash } from "bcrypt";
import { Request,Response } from 'express';
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from './db';
import { JWT_SECRET,mongodburl } from './config';
import { Usermiddleware } from './middleware';

const app=express();
app.use(express.json());
app.use(cors({
   origin: 'http://localhost:5173',
   credentials:true
}));
async function abc() {
  await mongoose.connect(mongodburl);
}

abc()
  .then(() => {
    console.log("MongoDB connected");
  
  })
  .catch(err => {
    console.error("MongoDB connection failed", err);
  });


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
    return;
  }
  catch(e){
    res.status(500).json({
      msg:"Error sigining in "
    })
    return ;

  }
})
  
app.post("/api/v1/content" , Usermiddleware,async (req,res)=>{
  

  const {title,content,link,type}=req.body
  

 try{
  const Content=await ContentModel.create({
    title:title,
    content:content,
    link:link,
    type:type,
    Userid:req.Userid
    
})
res.status(200).json({
  msg:"Content was added"

})
return ;
 }
 catch(e){
  res.status(400).json({
    msg:"There was a error adding a content "
  })
  return;

 }


})
app.get("/api/v1/content",Usermiddleware, async (req,res)=>{
  const data=await ContentModel.findOne({
    Userid:req.Userid
  }).populate("Userid","username")
  res.status(200).json({
    data
  })
  console.log("HI there");


})
app.delete("/api/v1/content",Usermiddleware, async(req,res)=>{
  const Contentid=req.body.Contentid;
 await ContentModel.deleteMany({
  Contentid,
  Userid:req.Userid
  })
     
})
app.post("/api/v1/brain/share", Usermiddleware,async(req,res)=>{
  const share=req.body.share;

 
  try {if(share){
    const existing=await LinkModel.findOne({
     Userid:req.Userid
    
    })
    if(existing){
      res.json({
        hash:existing.hash
      })
    }
    const correcthash=randomhash(10);

    const existingLink= await LinkModel.create({
      Userid:req.Userid,
      hash:correcthash

    })
    console.log(existingLink)
    res.json({
      correcthash 
    })
    return;
  }
  

  const existinglink=await LinkModel.deleteOne({
    
    Userid:req.Userid

  })
  res.json({
    msg:'link delted succesfully '
  })
  return
 }
 catch(eror){
  res.json({
    msg:"link already exist"
  })
}
})
app.get("/api/v1/brain/:sharelink",async(req,res)=>{
  const hash=req.params.sharelink;
  const link=await LinkModel.findOne({
    hash:hash
  })
  if(!link){
     res.json({
      msg:"Link does not exist "
    })
    return ;
  
  }
const User=await UserModel.findOne({
  _id:link.Userid
})
const content=await ContentModel.findOne({
  Userid:link.Userid
})
res.json({
  content,
  User:{
    username:User?.username,
    id:User?._id
  }
})
})


app.listen(3000, '0.0.0.0', () => {
  console.log("Server listening on port 3000");
}) ;