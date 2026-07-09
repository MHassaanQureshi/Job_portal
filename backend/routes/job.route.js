import express from "express"
import isAuthenticated from '../middleware/isAuthenticated.js';
import { uploadJob,GetAllJobs,GetAdminJob,GetJobById, updateJob } from "../controllers/job.controller.js";
const JobRoutes = express.Router()
JobRoutes.route("/uploadJob").post(isAuthenticated,uploadJob)
JobRoutes.route("/Get").get(isAuthenticated,GetAllJobs)
JobRoutes.route("/getJobByid/:id").get(isAuthenticated,GetJobById)
JobRoutes.route("/GetAdminJob").get(isAuthenticated,GetAdminJob)
JobRoutes.route("/updateJob/:id").post(isAuthenticated,updateJob)

export default JobRoutes