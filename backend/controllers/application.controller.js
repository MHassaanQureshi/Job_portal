import { Application } from "../models/application.model.js";

export const PostApplication = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        if (!jobId || !userId) {
            return res.status(400).json({
                message: "missing req id's",
                success: false
            })
        }

        const existingApplication = await Application.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }

        const application = await Application.create({ job:jobId, applicant:userId });

        if (!application) {
            return res.status(400).json({
                message: "failed to create application",
                success: false
            })
        }

        return res.status(201).json({
            message: "created application successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: `error: ${error.message}`,
            success: false
        })
    }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params        
        const { status } = req.body     

        const allowedStatuses = ["pending", "accepted", "rejected"]
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            })
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { Status: status },
            { new: true, runValidators: true }
        )

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
            application,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error while updating status",
        })
    }
}

export const GetAppByID = async(req,res) =>{
    try{

        const AppID = req.params.id;
        if(!AppID){
            return res.status(400).json({
                message:"no ID found",
                success:false
            })

        }
        const application = await Application.findById(AppID)
        if(!application){
            return res.status(400).json({
                message:"no application found",
                success:false
            })
        }
        return res.status(200).json({
            message:"found application",
            application,
            success:true
        })

    }catch(error){
        return res.status(401).json({
            message:`error:${error}`,
            success:false
        })
    }
}
export const GetAppByUserID = async(req,res) =>{
    try{

        const UserID = req.params.id;
       
        if(!UserID){
            return res.status(400).json({
                message:"no ID found",
                success:false
            })

        }
        const application = await Application.findOne({applicant:UserID})

        if(!application){
            return res.status(400).json({
                message:"no application found",
                success:false
            })
        }
        return res.status(200).json({
            message:"found application",
            application,
            success:true
        })

    }catch(error){
        return res.status(401).json({
            message:`error:${error}`,
            success:false
        })
    }
}