import mongoose from "mongoose";
import dotenv from "dotenv";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Database connected successfully");
    } catch (error) {
        console.log(`Failed to connect to DB: ${error}`);
    }
};

export default connectDB;
