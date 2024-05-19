import jwt from "jsonwebtoken"
import UserModel from "../models/user.js"

export const protectRoute =async (req,res,next)=>{
    try {
        
        const token = req.cookies.jwt
        if(!token){
            return res.status(400).json({error : "Unauthorized - No token Provided"})
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET)

        if(!decode){
            return res.status(400).json({error : "Unauthorized - Invalid token"})
        }

        //imp line .select it removes password
        const user = await UserModel.findById(decode.userId).select("-password")

        if(!user){
            return res.status(400).json({error : "User Not found"})
        }

        req.user = user;
        next()

    } catch (error) {
        console.log(` error at protectRoute MiddleWare ${error}`);
        res.status(500).json({error : "Internal Server Error"})
    }
}