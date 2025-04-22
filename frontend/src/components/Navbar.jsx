import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between">
      <h1 className="text-xl font-bold">Leave Management</h1>
      <div>
        {user?.role === "manager" ? (
          <>
            <Link to="/manager" className="mr-4">Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/employee/request-leave" className="mr-4">Request Leave</Link>
            <Link to="/employee/my-leaves">My Leaves</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;