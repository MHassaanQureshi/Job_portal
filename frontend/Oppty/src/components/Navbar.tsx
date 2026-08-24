import CustomButton from "./CustomButton";
import { useState } from "react";
import { Menu } from 'lucide-react';
export default function Navbar(){
    const[isOpen,setOpen] = useState(false)

    

    return(
        <>
        <div className="flex flex-col w-full h-[20%] p-2  justify-between bg-[#020B2E] text-white md:hidden border-[#020B2E]">
            <div className="w-full p-2 flex flex-row justify-between">
                <img src="/images/Oppty.png" alt="unable to load image" className="w-20 "/>
                <button onClick ={()=> setOpen(!isOpen)}><Menu size={24} /></button>
            </div>
            
           {isOpen &&  <div className="flex flex-col gap-5">
                <ul className="flex flex-col gap-5  text-l mt-2 font-extrabold">
                    <li>Home</li>
                    <li>Search Jobs</li>
                    <li>Success Stories</li>

                </ul>
            <div className=" flex flex-row gap-5">
                <CustomButton link="" text="Sign IN"/>
                <CustomButton link="" text="Register"/>
            </div>
            </div>}
            
        </div>
    <div className="hidden md:flex flex-row items-center justify-between w-full h-20 px-6 py-2 bg-[#020B2E] text-white">
  <div className="flex items-center">
    <img src="/images/Oppty.png" alt="Oppty logo" className="w-30" />
  </div>

  <div className="flex flex-row items-center gap-8">
    <ul className="flex flex-row gap-5 text-lg font-extrabold">
      <li><a href="/">Home</a></li>
      <li><a href="/search-jobs">Search Jobs</a></li>
      <li><a href="/success-stories">Success Stories</a></li>
    </ul>

    
  </div>
  <div className="flex flex-row gap-5">
      <CustomButton link="/signin" text="Sign In" />
      <CustomButton link="/signup" text="Register" />
    </div>
</div>
        </>
    )
}