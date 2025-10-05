import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ token, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate(user?.role === "ADMIN" ? "/admin/login" : "/login");
  };

  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        MyVotingApp
      </Link>

      <nav className="space-x-4">
        {!token ? (
          <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/register" className="hover:text-gray-200">Register</Link>
            <Link to="/admin/login" className="hover:text-gray-200">Admin</Link>
          </>
        ) : (
          <>
            <Link to="/" className="hover:text-gray-200">Home</Link>
            {user?.role === "VOTER" && <Link to="/vote" className="hover:text-gray-200">Vote</Link>}
            <Link to="/results" className="hover:text-gray-200">Results</Link>
            {user?.role === "ADMIN" && <Link to="/admin" className="hover:text-gray-200">Admin Dashboard</Link>}
            <button onClick={handleLogoutClick} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
