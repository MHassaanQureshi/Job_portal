import express from "express"
import isAuthenticated from '../middleware/isAuthenticated.js';
import { getCompany, getCompanybyId, register, updateCompany } from "../controllers/company.controller.js"
const CompanyRoutes = express.Router()
CompanyRoutes.route("/register").post(isAuthenticated ,register)
CompanyRoutes.route("/update/:id").post(isAuthenticated,updateCompany)
CompanyRoutes.route("/getcompanybyid/:id").get(isAuthenticated,getCompanybyId)
CompanyRoutes.route("/getCompany").get(isAuthenticated,getCompany)

export default CompanyRoutes