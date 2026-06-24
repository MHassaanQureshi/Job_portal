import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import UserRouter from "./routes/user.route.js";
import CompanyRoutes from "./routes/company.route.js";
const app = express()
dotenv.config({});

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
const corsOptions ={
    origion:"http//localhost:5173",
    credentials:true
}

app.use(cors(corsOptions));
const PORT = process.env.PORT


// API's

app.use("/api/v1/user",UserRouter)
app.use("/api/v1/company",CompanyRoutes)
app.listen(PORT ,() =>{
    connectDB()
    console.log(`port running at ${PORT}`)
} )