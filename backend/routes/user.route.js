import express from 'express'
import { register,login,updateProfile,logout } from '../controllers/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
const UserRouter = express.Router();

UserRouter.route("/register").post(register);
UserRouter.route("/login").post(login);
UserRouter.route("/logout").get(logout);
UserRouter.route("/profile/update").post(isAuthenticated,updateProfile);




export default UserRouter;