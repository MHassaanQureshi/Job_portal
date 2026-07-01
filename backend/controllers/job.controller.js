import { Job } from "../models/job.model.js";

export const uploadJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            locations,
            jobType,
            position,
            company
        } = req.body;

        

        if (
            !title ||
            !description ||
            !salary ||
            !locations ||
            !jobType ||
            !position ||
            !company
        ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            locations,
            jobType,
            position,
            company,
            created_by: req.id
        });

        return res.status(201).json({
            message: "Job uploaded successfully",
            job,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const GetAllJobs = async (req,res) =>{
    try{

    }catch(error){
        return res.status(401).json({
            message:`error:${error}`,
            success:false
        })

    }
}