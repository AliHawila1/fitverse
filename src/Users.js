import { useState, useEffect } from "react";
import { api } from "./api.js";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDelete = async (user_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

   try {
      await api.delete(`/users/${user_id}`);
      setUsers((prev) => prev.filter((u) => u.user_id !== user_id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", newUser);
      const createdId = res.data?.user_id;

      setUsers((prev) => [
        ...prev,
        {
          user_id: createdId ?? Date.now(),
          username: newUser.username,
          email: newUser.email,
          phone_number: newUser.phone_number,
        },
      ]);

      setNewUser({ username: "", email: "", phone_number: "", password: "" });
      setShowForm(false);
      alert("User added successfully");
    } catch (err) {
      console.error("Add user failed:", err?.response?.data || err.message);
      alert("Failed to add user in backend");
    }
  };

  return (
   <div className="min-h-screen bg-gray-100 p-6 pt-28 flex flex-col items-center">

      <div className="w-full max-w-6xl flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Users List</h1>

        <button
          onClick={() => setShowForm((p) => !p)}
          className="bg-[#00df9a] text-black px-4 py-2 rounded-lg font-bold"
        >
          {showForm ? "Close" : "+ Add User"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddUser}
          className="w-full max-w-6xl bg-white rounded-2xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            name="username"
            value={newUser.username}
            onChange={handleChange}
            placeholder="Username"
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            value={newUser.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="border p-2 rounded"
            required
          />
          <input
            name="phone_number"
            value={newUser.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-2 rounded"
            required
          />
          <input
            name="password"
            value={newUser.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="border p-2 rounded"
            required
          />

          <button className="md:col-span-4 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
            Create User
          </button>
        </form>
      )}

      <div className="overflow-x-auto w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{u.user_id}</td>
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone_number}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(u.user_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
