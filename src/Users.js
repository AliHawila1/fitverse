import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDelete = async (user_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/users/${user_id}`);
      setUsers(users.filter((user) => user.user_id !== user_id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Users List</h1>
      <div className="overflow-x-auto w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 rounded-t-3xl">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{user.user_id}</td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone_number}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
