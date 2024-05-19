import mongoose from "mongoose"

export const connectWithDb =async ()=>{
    await mongoose.connect(process.env.DB_URL).then(()=>{console.log("Db Connected")}).catch((err)=>{console.log("Db Not Connected"); })
}