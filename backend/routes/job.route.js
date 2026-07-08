import express from "express"
import isAuthenticated from '../middleware/isAuthenticated.js';
import { uploadJob,GetAllJobs,GetAdminJob,GetJobById } from "../controllers/job.controller.js";
const JobRoutes = express.Router()
JobRoutes.route("/uploadJob").post(isAuthenticated,uploadJob)
JobRoutes.route("/Get").get(isAuthenticated,GetAllJobs)
JobRoutes.route("/getJobByid").get(isAuthenticated,GetJobById)
JobRoutes.route("/GetAdminJob").get(isAuthenticated,GetAdminJob)

export default JobRoutes