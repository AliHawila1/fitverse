import React, { useState } from 'react';
import NavBar from "./Components/NavBar";
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Equipments from './pages/Equipments';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Intro from './Components/Intro';
import Users from './Users';
import Orders from './Orders';
import Registration from './pages/Registration';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = (item) => setCart([...cart, item]);
  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };
  const clearCart = () => setCart([]);
  const handleLogin = (userData) => setUser(userData); 
  const handleLogout = () => setUser(null);

  return (
    <div className="App">
      <Router>
        <NavBar cartCount={cart.length} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<Intro/>}/>
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/registration" element={<Registration />} />

          {/* Services & Equipments visible to both admin and users */}
          <Route 
            path="/services" 
            element={<Services onAddToCart={addToCart} user={user} />} 
          />
          <Route 
            path="/equipments" 
            element={<Equipments onAddToCart={addToCart} user={user} />} 
          />

          {/* Cart only for normal users */}
          <Route 
            path="/cart" 
            element={user && user.username !== "admin" ? (
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} user={user} />
            ) : (
              <Navigate to="/login" />
            )}
          />

          {/* Admin Dashboard only for admin */}
          <Route 
            path="/adminDashboard" 
            element={user && user.username === "admin" ? <AdminDashboard user={user} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
