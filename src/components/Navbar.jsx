import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChefHat,
  Home,
  Book,
  Calendar,
  ShoppingCart,
  User,
  LogIn,
  Users,
  Mail,
  LayoutDashboard
} from "lucide-react";

export default function Navbar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const NavButton = ({ icon, text, to }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition ${isActive
            ? "bg-white text-orange-500 font-semibold"
            : "hover:bg-orange-600 hover:text-white"
          }`}
      >
        {icon}
        <span>{text}</span>
      </Link>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
   <nav className="bg-linear-to-r from-orange-600 via-red-600 to-rose-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <ChefHat className="w-8 h-8" />
          <span className="text-2xl font-bold">FlavorFusion</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-1">
          {/*Show Dashboard only if user is logged in */}
          {user && (
            <NavButton
              icon={<LayoutDashboard className="w-4 h-4" />}
              text="Dashboard"
              to="/dashboard"
            />
          )}
          <NavButton icon={<Home className="w-4 h-4" />} text="Home" to="/" />
          <NavButton icon={<Book className="w-4 h-4" />} text="Recipes" to="/recipes" />
          <NavButton icon={<Calendar className="w-4 h-4" />} text="Meal Plan" to="/mealplan" />
          <NavButton icon={<ShoppingCart className="w-4 h-4" />} text="Shopping" to="/shopping" />
          <NavButton icon={<User className="w-4 h-4" />} text="Pantry" to="/pantry" />
          <NavButton icon={<Users className="w-4 h-4" />} text="Community" to="/community" />
          <NavButton icon={<Mail className="w-4 h-4" />} text="Contact" to="/contact" />

        </div>

        {/* Auth Buttons */}
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition flex items-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
