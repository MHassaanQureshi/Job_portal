import {Company} from "../models/company.model.js"
export const register = async (req,res)=>{
    try{
        const {name,bio,website,location,logo} = req.body;
        if(!name || !bio || !website || !location || !logo){
            return res.status(400).json({
                messsage:"something is missing",
                success:false
            })
        }
        let company = await Company.findOne({name});
        if(company){
            return res.status(400).json({
                message:"company already exsists",
                success:false
            })
        }
         await Company.create({
            name,
            userId:req.id,
            bio,
            location,
            website,
            logo,
        })
        return res.status(201).json({
            message: "Company registered successfully",
            success: true,
         });
    }catch(error){
        return res.status(400).json({
            message:`error : ${error}`,
            success:false
        })

    }

}

export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    const { name, bio, website, location, logo } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        name,
        bio,
        website,
        location,
        logo,
      },
      {
        new: true, // returns updated document
        runValidators: true, // runs schema validations
      }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
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

export const getCompany = async (req, res) => {
    try {
        const userId = req.params.id;

        const companies = await Company.find({ userId });

        if (companies.length === 0) {
            return res.status(404).json({
                message: "No companies under your name",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        return res.status(400).json({
            message: `error: ${error.message}`,
            success: false
        });
    }
};

export const getCompanybyId = async(req,res)=>{

  try{
    const companyId = req.params.id;
    const company = await Company.findById(companyId)
    if(!company){
      return res.status(400).json({
        message:"no company found",
        success:false
      })
    }
    return res.status(200).json({
      message:"company found",
      company,
      success:true

    })


  }catch(error){
    console.log(error);
    
  }
}