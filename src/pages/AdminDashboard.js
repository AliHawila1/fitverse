import React from "react";
import { useNavigate } from "react-router-dom";

const dashboardItems = [
  {
    title: "Users",
    description: "View and manage all registered users",
    route: "/users",
  },
  {
    title: "Orders",
    description: "View and manage all orders",
    route: "/orders",
  },
  {
    title: "Programs",
    description: "Add, Edit or Delete your training programs",
    route: "/services?admin=true", 
  },
  {
    title:"Equipments",
    description:"View and manage all equipment",
    route:"/equipments?admin=true",
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <button 
          onClick={() => navigate("/")} 
          className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.route)}
            className="cursor-pointer bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 w-72 h-72 flex flex-col justify-center items-center text-center border-b-8 border-blue-500"
          >
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">{item.title}</h2>
            <p className="text-gray-600 text-lg leading-tight">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;