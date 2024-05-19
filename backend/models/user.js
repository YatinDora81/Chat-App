import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        require : true
    },
    userName : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true,
    },
    gender : {
        type : String,
        require : true,
        enum : ["male","female"]
    },
    profilePic : {
        type  : String,
        default : ""
    }
},{timestamps : true})

const User = mongoose.model("User",userSchema)
export default User