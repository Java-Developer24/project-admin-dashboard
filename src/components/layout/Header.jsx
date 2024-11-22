import React from "react";
import Logo from "@/assets/Logo-removebg-preview.png";
import { Link } from "react-router-dom";
import { useAuth } from "@/utils/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally, you can redirect the user after logging out
    window.location.href = "/login"; // Or use a navigation hook from react-router-dom
  };

  return (
    <header className="top-0 inset-x-0 h-[4rem] py-4 sticky bg-black lg:py-2 z-50">
      <div className="md:container px-[1rem] h-full mx-auto flex items-center justify-between gap-2">
        <Link to="/" className="flex title-font font-medium items-center">
          <img src={Logo} alt="logo" className="w-[100px] md:w-[150px]" />
        </Link>

        <div className="flex items-center gap-4">
          <h3 className="text-sm">Admin Panel</h3>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
