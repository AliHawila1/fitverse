import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
    return(
        <div className='Footer bg-black text-white py-8 border-t border-gray-800'>
            <div className='container mx-auto px-4'>
                <div className='mediaIcons flex justify-center space-x-6 mb-4'>
                    <InstagramIcon className="cursor-pointer hover:text-[#00df9a] transition duration-300" />
                    <FacebookIcon className="cursor-pointer hover:text-[#00df9a] transition duration-300" />
                    <LinkedInIcon className="cursor-pointer hover:text-[#00df9a] transition duration-300" />
                </div>   
                <p className="text-center text-gray-400">
                    © 2024 FitVerse. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default Footer;