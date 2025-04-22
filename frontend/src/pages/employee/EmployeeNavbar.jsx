import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

const EmployeeNavbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar Toggle Button */}
      <button
        className="fixed top-5 left-5 z-50 text-white text-3xl bg-blue-900 p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Navigation (Always on Top) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-2xl p-6 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ overflowY: "auto" }} // Makes sidebar scrollable if content is too long
      >
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Employee Panel
        </h2>

        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/employee/request-leave"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              Request Leave
            </Link>
          </li>
          <li>
            <Link
              to="/employee/attendance"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              Attendance
            </Link>
          </li>
          <li>
            <Link
              to="/employee/complaints"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              My Complaints
            </Link>
          </li>
          <li>
            <Link
              to="/employee/submit-complaint"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              Submit Complaint
            </Link>
          </li>
          <li>
            <Link
              to="/employee/messages"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              Messages
            </Link>
          </li>
          <li>
            <Link
              to="/roomfront"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              Video Call
            </Link>
          </li>
          <li>
            <Link
              to="/calender"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
             Calender
            </Link>
          </li>
          <li>
            <Link
              to="/employee/send-message"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              Send Message
            </Link>
          </li>
          <li>
            <Link
              to="/employee/users"
              className="block text-gray-300 hover:text-yellow-500 text-lg font-medium transition-all"
              onClick={() => setIsOpen(false)}
            >
              All Users
            </Link>
          </li>
        </ul>

        <div className="mt-10 text-center">
          <p className="text-gray-400">Welcome, {user?.name}</p>
          <button
            onClick={logout}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Push Content to Prevent Overlapping */}
      <div className="pl-20 pt-16">
        {/* Main Content Goes Here */}
      </div>
    </>
  );
};

export default EmployeeNavbar;
