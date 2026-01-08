import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";

const NavBar = ({ cartCount = 0, user, onLogout }) => {
  const [menu, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = !!user && (user.username === "admin" || user.isAdmin === true);

  const handleNav = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    closeMenu();
    navigate("/"); //  goes back to home after logout
  };

  return (
    <div className="flex justify-between items-center h-24 mx-auto px-4 text-white fixed top-0 left-0 w-full z-50 bg-black">
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">
        <Link to="/" onClick={closeMenu}>FitVerse</Link>
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center">
        {/* Always visible */}
        <li className="p-4"><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li className="p-4"><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li className="p-4"><Link to="/contact" onClick={closeMenu}>Contact</Link></li>

        {/* User menu (not admin) */}
        {user && !isAdmin && (
          <>
            <li className="p-4"><Link to="/services" onClick={closeMenu}>Services</Link></li>
            <li className="p-4"><Link to="/equipments" onClick={closeMenu}>Equipments</Link></li>

            <li className="p-4 ml-4 cursor-pointer relative">
              <Link to="/cart" onClick={closeMenu}>
                <AiOutlineShoppingCart size={25} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#00df9a] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </>
        )}

        {/* Admin menu */}
        {user && isAdmin && (
          <li className="p-4">
            <Link to="/admin-dashboard" onClick={closeMenu}>
              Admin Dashboard
            </Link>
          </li>
        )}

        {/* Auth button */}
        {user ? (
          <li className="p-4">
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout ({user.username})
            </button>
          </li>
        ) : (
          <li className="p-4">
            <Link
              to="/login"
              onClick={closeMenu}
              className="bg-[#00df9a] text-black px-4 py-2 rounded-lg hover:bg-[#00c785] transition duration-300"
            >
              Login
            </Link>
          </li>
        )}
      </ul>

      {/* Mobile menu toggle */}
      <div onClick={handleNav} className="block cursor-pointer md:hidden z-10">
        {menu ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
      </div>

      {/* Mobile Menu */}
      <div
        className={
          menu
            ? "fixed left-0 top-0 w-[70%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
          <Link to="/" onClick={closeMenu}>FitVerse</Link>
        </h1>

        <ul className="uppercase p-4">
          {/* Always visible */}
          <li className="p-4 border-b border-gray-600">
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li className="p-4 border-b border-gray-600">
            <Link to="/about" onClick={closeMenu}>About</Link>
          </li>
          <li className="p-4 border-b border-gray-600">
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </li>

          {/* User menu (not admin) */}
          {user && !isAdmin && (
            <>
              <li className="p-4 border-b border-gray-600">
                <Link to="/services" onClick={closeMenu}>Services</Link>
              </li>
              <li className="p-4 border-b border-gray-600">
                <Link to="/equipments" onClick={closeMenu}>Equipments</Link>
              </li>
              <li className="p-4 border-b border-gray-600">
                <Link to="/cart" onClick={closeMenu}>Cart ({cartCount})</Link>
              </li>
            </>
          )}

          {/* Admin menu */}
          {user && isAdmin && (
            <li className="p-4 border-b border-gray-600">
              <Link to="/admin-dashboard" onClick={closeMenu}>Admin Dashboard</Link>
            </li>
          )}

          {/* Auth */}
          {user ? (
            <li className="p-4 border-b border-gray-600">
              <button onClick={handleLogoutClick} className="text-red-500 w-full text-left">
                Logout ({user.username})
              </button>
            </li>
          ) : (
            <li className="p-4 border-b border-gray-600">
              <Link to="/login" onClick={closeMenu}>Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
