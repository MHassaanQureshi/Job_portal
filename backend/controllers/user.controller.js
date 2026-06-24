import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    // 1. validation
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // 2. check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    // 5. response
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const login = async(req,res)=>{
    try{
        const {email,password,role} = req.body;
          if( !email|| !password|| !role){
            return res.status(400).json({
                message:"something is missing",
                success:false,
            })}
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"incorrect email",
                success:false
            })
        }
        const ispasswordMatch = await bcrypt.compare(password,user.password)
        if(!ispasswordMatch){
            return res.status(400).json({
                message:"incorrect  password",
                success:false
            })
        }
        if(role !== user.role){
            return res.status(400).json({
                message:"incorrect role",
                success:false
            })
        }

        const tokenData = {
            userId:user._id
        }
        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,   
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:"1d"});
        return res.status(200).cookie("token", token, {
                 maxAge: 24 * 60 * 60 * 1000 // 1 day
        ,httpsOnly:true,sameSite:"strict"}).json({
            message:`welcome back ${user.fullname}`,
            success:true
        })

    }catch(error){
        console.log(error)

    }
}

export const logout = async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logged out successully",
            success:true
        })
    }catch(error){
        console.log(error)

    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            fullname,
            role,
            email,
            password,
            phoneNumber,
            bio,
            skills
        } = req.body;

        const file = req.file;

        // Convert skills string into array
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",").map(skill => skill.trim());
        }

        // Get user id from authentication middleware
        const userId = req.id;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Update fields if provided
        if (fullname) {
            user.fullname = fullname;
        }

        if (email) {
            user.email = email;
        }

        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }

        if (role) {
            user.role = role;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Ensure profile exists
        if (!user.profile) {
            user.profile = {};
        }

        if (bio) {
            user.profile.bio = bio;
        }

        if (skillsArray) {
            user.profile.skills = skillsArray;
        }

        // TODO: Handle resume upload using `file`
        // Example:
        // if (file) {
        //     user.profile.resume = file.path;
        // }

        await user.save();

        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};