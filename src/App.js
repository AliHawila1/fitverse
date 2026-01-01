import { useState } from 'react';
import NavBar from "./Components/NavBar.js";
import About from './pages/About.js';
import Services from './pages/Services.js';
import Contact from './pages/Contact.js';
import Equipments from './pages/Equipments.js';
import Cart from './pages/Cart.js';
import Login from './pages/Login.js';
import AdminDashboard from './pages/AdminDashboard.js';
import Intro from './Components/Intro.js';
import Users from './Users.js';
import Orders from './Orders.js';
import Registration from './pages/Registration.js';
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
