import { useState } from "react";
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
    navigate("/"); 
  };

  return (
    <div className="fixed w-full top-0 left-0 z-50 bg-black shadow-md">
      <div className="flex justify-between items-center h-24 mx-auto px-6 md:px-12 text-white">
        <h1 className="text-3xl font-extrabold text-orange-500">
          <Link to="/" onClick={closeMenu}>FitVerse</Link>
        </h1>

        <ul className="hidden md:flex items-center space-x-6 text-lg font-semibold">
          <li>
            <Link to="/" onClick={closeMenu} className="hover:text-orange-500 transition">Home</Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu} className="hover:text-orange-500 transition">About</Link>
          </li>
          
          {!isAdmin && user && (
            <>
              <li>
                <Link to="/services" onClick={closeMenu} className="hover:text-orange-500 transition">Services</Link>
              </li>
              <li>
                <Link to="/equipments" onClick={closeMenu} className="hover:text-orange-500 transition">Equipments</Link>
              </li>
              <li className="relative">
                <Link to="/cart" onClick={closeMenu} className="hover:text-orange-500 transition flex items-center">
                  <AiOutlineShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-black w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <li>
              <Link to="/admin-dashboard" onClick={closeMenu} className="hover:text-orange-500 transition">Admin Dashboard</Link>
            </li>
          )}

          {user ? (
            <li>
              <button
                onClick={handleLogoutClick}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition"
              >
                Logout ({user.username})
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                onClick={closeMenu}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-bold transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        <div onClick={handleNav} className="md:hidden cursor-pointer z-50">
          {menu ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
        </div>

        <div
          className={`fixed top-0 left-0 h-full w-[70%] bg-black shadow-lg transform ${
            menu ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-40`}
        >
          <h1 className="text-3xl font-extrabold text-orange-500 m-6">
            <Link to="/" onClick={closeMenu}>FitVerse</Link>
          </h1>
          <ul className="flex flex-col uppercase text-white p-6 space-y-4 text-lg">
            <li>
              <Link to="/" onClick={closeMenu} className="hover:text-orange-500 transition">Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu} className="hover:text-orange-500 transition">About</Link>
            </li>
            <li>
              <Link to="/contact" onClick={closeMenu} className="hover:text-orange-500 transition">Contact</Link>
            </li>

            {!isAdmin && user && (
              <>
                <li>
                  <Link to="/services" onClick={closeMenu} className="hover:text-orange-500 transition">Services</Link>
                </li>
                <li>
                  <Link to="/equipments" onClick={closeMenu} className="hover:text-orange-500 transition">Equipments</Link>
                </li>
                <li>
                  <Link to="/cart" onClick={closeMenu} className="hover:text-orange-500 transition">
                    Cart ({cartCount})
                  </Link>
                </li>
              </>
            )}

            {isAdmin && (
              <li>
                <Link to="/admin-dashboard" onClick={closeMenu} className="hover:text-orange-500 transition">Admin Dashboard</Link>
              </li>
            )}

            {user ? (
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="bg-red-600 hover:bg-red-700 w-full py-2 rounded-lg font-bold transition"
                >
                  Logout ({user.username})
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="bg-orange-500 hover:bg-orange-600 w-full py-2 rounded-lg font-bold transition text-black text-center"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
