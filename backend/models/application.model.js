import mongoose from "mongoose"

const ApplicationSchema = new mongoose.Schema({
     job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        require:true,


     },
     applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
     },
     Status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending",
     },
},{timeStamps:true})

export const Application = mongoose.model(Application,ApplicationSchema)