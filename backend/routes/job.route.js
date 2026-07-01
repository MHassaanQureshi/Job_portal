import express from "express"
import isAuthenticated from '../middleware/isAuthenticated.js';
import { uploadJob } from "../controllers/job.controller.js";
const JobRoutes = express.Router()
JobRoutes.route("/uploadJob").post(isAuthenticated,uploadJob)

export default JobRoutes