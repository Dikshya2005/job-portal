import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config({});

const app = express()

// app.get("/home",(req,res) =>{
//     return res.status(200).json({
//         message:"Welcome to home page",
//         success:true
//     })
// })

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http//localhost:5173',
    Credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// API collection ..
app.use("/api/v1/user", userRoute);
// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/profile/update"

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
});