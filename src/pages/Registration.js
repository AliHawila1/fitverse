import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Registration = () => {
    const[formData,setFormdata]=useState({
        username:"",
        email:"",
        password:"",
        phone_number:""
    });
    const navigate=useNavigate();
    const handleChange=(e)=>{
        setFormdata({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault(); 
        try{
            await axios.post("http://localhost:5000/users",formData);alert("Registration successful");
            navigate("/login");
        }
         catch(err){
            console.log(err);
            alert("Registration failed");
                 }} 
                return(
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone_number">Phone Number</label>
            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Register</button>

</form>
   );
}        
export default Registration;