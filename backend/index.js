import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
const app = express()
dotenv.config({});

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOptions ={
    origion:"http//localhost:5173",
    credentials:true
}

app.use(cors(corsOptions));
const PORT = process.env.PORT

app.listen(PORT ,() =>{
    connectDB()
    console.log(`port running at ${PORT}`)
} )