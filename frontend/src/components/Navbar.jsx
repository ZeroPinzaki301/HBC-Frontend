import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="font-serif bg-zinc-800 text-white py-4 px-6 flex items-center justify-between relative">
      {/* Logo/Brand Name */}
      <div className="text-2xl font-bold">HypeBeans Cafe</div>

      {/* Navigation Links for Desktop - centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
        <ul className="flex gap-20">
          <li className="hover:underline cursor-pointer transition duration-200 hover:text-amber-100 text-xl tracking-widest">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:underline cursor-pointer transition duration-200 hover:text-amber-100 text-xl tracking-widest">
            <Link to="/products">Products</Link>
          </li>
          <li className="hover:underline cursor-pointer transition duration-200 hover:text-amber-100 text-xl tracking-widest">
            <Link to="/about">About Us</Link>
          </li>
          <li className="hover:underline cursor-pointer transition duration-200 hover:text-amber-100 text-xl tracking-widest">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Account Icon with Dropdown - right aligned */}
      <div className="relative hidden md:block">
        <FaUserCircle
          className="text-3xl cursor-pointer hover:text-amber-100 transition duration-200"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg py-2 w-48 z-50">
            <Link
              to="/account"
              className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
              onClick={() => setDropdownOpen(false)}
            >
              Go to Account
            </Link>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
              onClick={() => {
                localStorage.removeItem("token"); // Clear token on logout
                window.location.href = "/login"; // Redirect to login
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle menu"
          className="hover:text-amber-100 transition duration-200"
        >
          {menuOpen ? (
            <AiOutlineClose className="text-2xl" />
          ) : (
            <AiOutlineMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-gray-600 text-white flex flex-col items-center gap-6 py-6 md:hidden z-40">
          <li>
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className="hover:underline hover:text-amber-100 transition duration-200 text-lg"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              onClick={() => setMenuOpen(false)}
              className="hover:underline hover:text-amber-100 transition duration-200 text-lg"
            >
              Products
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              onClick={() => setMenuOpen(false)}
              className="hover:underline hover:text-amber-100 transition duration-200 text-lg"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              onClick={() => setMenuOpen(false)}
              className="hover:underline hover:text-amber-100 transition duration-200 text-lg"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link 
              to="/account" 
              onClick={() => setMenuOpen(false)}
              className="hover:underline hover:text-amber-100 transition duration-200 text-lg"
            >
              Account
            </Link>
          </li>
          <li>
            <button 
              onClick={() => {
                localStorage.removeItem("token"); // Clear token on logout
                window.location.href = "/login"; // Redirect to login
              }}
              className="hover:underline hover:text-amber-100 transition duration-200 text-lg"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;