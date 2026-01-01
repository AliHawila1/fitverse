import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [state, setState] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = state;

    if (username === "admin" && password === "admin") {
      const adminUser = { username: "admin" };
      onLogin(adminUser);
      navigate("/adminDashboard");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", { username, password });
      const user = res.data;

      if (!user) {
        alert("Invalid username or password");
        return;
      }

      onLogin(user);
      navigate("/services"); 
    } catch (err) {
      console.log(err);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center p-4 pt-28">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Login to FitVerse</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Enter username"
              value={state.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={state.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00df9a] text-black font-bold py-3 rounded-lg hover:bg-[#00c785] transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/registration" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
           
          </div>
         
        </div>
  );
};

export default Login;
