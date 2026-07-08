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
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},

            ]
        }
         const jobs = await Job.find(query);
         if(!jobs){
            return res.status(400).json({
                message:"jo not found",
                success:false,
            })
         }
         return res.status(200).json({
            message:"found job",
            jobs,
            success:true,
         })

        
    }catch(error){
        return res.status(401).json({
            message:`error:${error}`,
            success:false
        })

    }
}

export const GetJobById = async(req,res)=>{
    try{
        const jobid = req.params.id;
        const job = await Job.findById(jobid);
        return res.status(200).json({
            message:"job founded",
            job,
            success:true
        })
        if(!job){
            return res.status(400).json({
            message:"job not founded",
            success:false
        })
        }

    }
    catch(error){
        return res.status(401).json({
            message:`got error:${error}`,
            success:false,
        })
    }
}
export const GetAdminJob = async(req,res) =>{
    try{

        const userId = req.id;
        const jobs = await Job.find({created_by:userId})
        return res.status(200).json({
            message:"found Jobs",
            jobs,
            success:true
        })

        if(!jobs){
            return res.status(400).json({
            message:"job not founded",
            success:false
        })
        }

    }
    catch(error){
        return res.status(401).json({
            message:`caught an error : ${error}`,
            success:false
        })
    }
}
