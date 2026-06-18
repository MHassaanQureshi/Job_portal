import mongoose from "mongoose"
const CompanySchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    Bio:{
        type:String,
        require:true,
    },
    Website:{
        type:String,
        
    },
    location:{
        type:String,
        
    },
    logo:{
        type:String,

    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:"true",
    },
},{timestamps:true})
export const Company = mongoose.Schema(Company,CompanySchema)