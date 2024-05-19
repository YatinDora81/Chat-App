import UserModel from "../models/user.js";


export const getUserForSideBar = async(req,res)=>{
    try {
        
        const loggedInuserId = req.user._id;

        //important because logged in user not show in sidebar
        const filterUser = await UserModel.find({_id : { $ne : loggedInuserId }}).select("-password")

        res.status(200).json(filterUser)
        
    } catch (error) {
        console.log("Error at getUserfor sidebar controller " , error);
        res.statua(500).json({error : "Internal server error"});
    }
}