import { Search } from "lucide-react";
export default function SearchBar(){
    return(
        <div className="text-black bg-blue-500 w-[80%] p-4 mt-5 flex flex-row align-middle justify-center gap-2 rounded-2xl items-center md:w-[50%] ">
            <input type="text" className=" bg-white w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black" />
            <Search className="w-12 h-12 text-white p-1" />
        </div>
    )
}