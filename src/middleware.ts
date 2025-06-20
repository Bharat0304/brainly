import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";
import { JWT_SECRET } from "./config";
export const Usermiddleware =(req:Request,res:Response,next:NextFunction) =>{
const token=req.headers.authorization
if(!token){
    res.status(400).json({
        msg:"Unauthorized"
    })
    return;
}
const tokens =token.split(' ')[1]
try{
const decoded =jwt.verify(token ,JWT_SECRET) as {id:string};
if(decoded){
    
    req.Userid=decoded.id
    next();
}
}
catch(e){
    res.status(400).json({
        msg:"Invalid token "
    })
    return;
}

}

