import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const register = async(req,res)=>{
    try{

        const {fullname,email,phoneNumber,password,role} = register.body;
        if(!fullname|| !email|| !phoneNumber|| !password|| !role){
            return res.status(400).json({
                message:"something is missing",
                success:false,
            })
            const user = await user.findOne({email})
            if(user){
                return res.status(400).json({
                    message:"user already exsist",
                    success:false
                })
            }
            const hashedpassword = await bcrypt.hash(password,10)
            await user.create({
                fullname,
                email,
                phoneNumber,
                password:hashedpassword,
                role,
                
            })
        }
    }catch(error){
        console.log(error)

    }
}

export const login = async(req,res)=>{
    try{
        const {email,password,role} = req.body;
          if( !email|| !password|| !role){
            return res.status(400).json({
                message:"something is missing",
                success:false,
            })}
        const user = await user.findOne({email})
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
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:"1d"})
        return.status(200).cookie("token",token,{maxAge:1x24})

    }catch(error){

    }
}