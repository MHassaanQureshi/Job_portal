import express from "express"
import isAuthenticated from '../middleware/isAuthenticated.js';
import { PostApplication,updateApplicationStatus,GetAppByID,GetAppByUserID ,GetApplicationsByJob} from "../controllers/application.controller.js";
const ApplicationRoutes = express.Router()

ApplicationRoutes.route("/post/:id").post(isAuthenticated,PostApplication)
ApplicationRoutes.route("/updatestatus/:id").put(isAuthenticated,updateApplicationStatus)
ApplicationRoutes.route("/getbyid/:id").get(isAuthenticated,GetAppByID)
ApplicationRoutes.route("/getbyuserid/:id").get(isAuthenticated,GetAppByUserID)
ApplicationRoutes.route("/getbyjob/:id").get(isAuthenticated,GetApplicationsByJob)

export default ApplicationRoutes