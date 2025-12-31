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
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.route)}
            className="cursor-pointer bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 w-72 h-72 flex flex-col justify-center items-center text-center"
          >
            <h2 className="text-3xl font-semibold mb-4">{item.title}</h2>
            <p className="text-gray-700 text-lg">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
