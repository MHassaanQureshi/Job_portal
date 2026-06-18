import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    requirements:[{
        type:String,
    }],
    salary:{
        type:Number,
        require:true,
    },
    locations:{
        type:String,
        require:true,
    },
    jobType:{
        type:String,
        require:true
    },
    postion:{
        type:Number,
        require:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        require:true,

    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,

    },
    application:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application",
    },


},{timestamps:true})
export const Job = mongoose.model(Job,JobSchema)
