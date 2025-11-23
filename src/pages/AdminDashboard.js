import React, { useState } from "react";

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@email.com", joinDate: "2024-01-15", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@email.com", joinDate: "2024-02-20", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@email.com", joinDate: "2024-03-10", status: "Inactive" }
  ]);

  const [orders, setOrders] = useState([
    { id: 1, userId: 1, userName: "John Doe", items: "Yoga Mat", total: "$30", status: "Completed", date: "2024-03-01" },
    { id: 2, userId: 2, userName: "Jane Smith", items: "Adjustable Dumbbells", total: "$120", status: "Pending", date: "2024-03-02" },
    { id: 3, userId: 1, userName: "John Doe", items: "Protein Shaker", total: "$5", status: "Completed", date: "2024-03-03" }
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        joinDate: new Date().toISOString().split('T')[0],
        status: "Active"
      };
      setUsers([...users, user]);
      setNewUser({ name: "", email: "" });
    }
  };

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setNewUser({ ...newUser, [name]: value });
  };

  if (user !== "admin") {
    return (
      <div className="bg-black min-h-screen text-white pt-28 px-6 md:px-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-28 px-6 md:px-12">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#00df9a]">User Management</h2>
          
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Add New User</h3>
            <div className="flex gap-2">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={handleChange}
                className="flex-1 p-2 rounded bg-gray-600 text-white"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleChange}
                className="flex-1 p-2 rounded bg-gray-600 text-white"
              />
              <button
                onClick={handleAddUser}
                className="bg-[#00df9a] text-black px-4 py-2 rounded hover:bg-[#00c785]"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <div>
                  <h4 className="font-bold">{user.name}</h4>
                  <p className="text-sm text-gray-300">{user.email}</p>
                  <span className={`text-xs px-2 py-1 rounded ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {user.status}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#00df9a]">Recent Orders</h2>
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="p-3 bg-gray-700 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{order.userName}</h4>
                    <p className="text-sm text-gray-300">{order.items}</p>
                    <p className="text-sm">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00df9a] font-bold">{order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#00df9a]">Statistics</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-3xl font-bold text-[#00df9a]">{users.length}</p>
              <p>Total Users</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-3xl font-bold text-[#00df9a]">{orders.length}</p>
              <p>Total Orders</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-3xl font-bold text-[#00df9a]">
                ${orders.reduce((total, order) => total + parseInt(order.total.replace('$', '')), 0)}
              </p>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;