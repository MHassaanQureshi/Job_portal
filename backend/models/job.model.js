import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    requirements:[{
        type:String,
    }],
    salary:{
        type:Number,
        required:true,
    },
    locations:{
        type:String,
        required:true,
    },
    jobType:{
        type:String,
        required:true
    },
    position:{
        type:Number,
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true,

    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    application:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application",
    },


},{timestamps:true})
export const Job = mongoose.model("job",JobSchema)
