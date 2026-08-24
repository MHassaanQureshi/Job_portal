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
      company,
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
        success: false,
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
      created_by: req.id,
    });

    return res.status(201).json({
      message: "Job uploaded successfully",
      job,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const GetAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 })
      .populate({ path: "created_by" }); 
    if (!jobs) {
      return res.status(400).json({
        message: "jo not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "found job",
      jobs,
      success: true,
    });
  } catch (error) {
    return res.status(401).json({
      message: `error:${error}`,
      success: false,
    });
  }
};

export const GetJobById = async (req, res) => {
  try {
    const jobid = req.params.id;

    const job = await Job.findById(jobid)
      .populate({ path: "company" })
      .populate({ path: "created_by" }); 

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job found",
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const GetAdminJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobs = await Job.find({ created_by: userId });
    return res.status(200).json({
      message: "found Jobs",
      jobs,
      success: true,
    });

    if (!jobs) {
      return res.status(400).json({
        message: "job not founded",
        success: false,
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: `caught an error : ${error}`,
      success: false,
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const JobId = req.params.id;

    const {
      title,
      description,
      requirements,
      salary,
      locations,
      jobType,
      position,
      company,
    } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      JobId,
      {
        title,
        description,
        requirements,
        salary,
        locations,
        jobType,
        position,
        company,
      },
      {
        returnDocument: "after",
        runValidators: true, 
      },
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
