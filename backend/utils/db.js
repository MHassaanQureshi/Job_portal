import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected")
    } catch(error){
        console.log(`fail to connect DB ${error}`)
    }

}
export default connectDB;
