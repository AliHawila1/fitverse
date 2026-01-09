import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Components/NavBar.js";
import Intro from "./Components/Intro.js";
import About from "./pages/About.js";
import Services from "./pages/Services.js";
import Equipments from "./pages/Equipments.js";
import Cart from "./pages/Cart.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import Users from "./Users.js";
import Orders from "./Orders.js";

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const isAdmin = !!user && (user.isAdmin === true || user.username === "admin");

  const addToCart = (item) => setCart((prev) => [...prev, item]);

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  return (
    <div className="App">
      <Router>
      
        <NavBar cartCount={cart.length} user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/registration" element={<Registration />} />
          <Route
            path="/services"
            element={<Services onAddToCart={addToCart} user={user} />}
          />
          <Route
            path="/equipments"
            element={<Equipments onAddToCart={addToCart} user={user} />}
          />

          <Route
            path="/cart"
            element={
              user && !isAdmin ? (
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  user={user}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              isAdmin ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/users"
            element={isAdmin ? <Users /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={isAdmin ? <Orders /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
