import express from "express"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"
import messageRoute from "./routes/message.js"
import userRoute from "./routes/user.js"
import { connectWithDb } from "./config/connectDb.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config()


const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth" , authRoutes)
app.use("/api/messages" , messageRoute);
app.use("/api/users" , userRoute);


app.listen(PORT,()=>{
    connectWithDb()
    console.log(`App is running at ${PORT}`)
})