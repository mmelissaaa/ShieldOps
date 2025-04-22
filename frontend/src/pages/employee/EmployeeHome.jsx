import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import EmployeeNavbar from "./EmployeeNavbar";
import { FaUserTie, FaCalendarAlt, FaClipboardList, FaChartBar } from "react-icons/fa";
import Chatbot from "../mel/Chatbot";

const EmployeeHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <EmployeeNavbar />
{/* <Chatbot/> */}
      <div className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center gap-8">
        {/* Centered Profile Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-xl flex flex-col items-center text-center transition transform hover:scale-105 hover:bg-opacity-20 w-96">
          {user?.profilePicture ? (
            <img
              src={`http://localhost:5000${user.profilePicture}`}
              alt={user.name}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4"
            />
          ) : (
            <FaUserTie className="text-blue-400 text-7xl mb-4 neon-glow" />
          )}
          <h3 className="text-2xl text-gray-900 font-bold">{user?.name}</h3>
          <p className="text-gray-900">{user?.role}</p>
        </div>

        {/* Row of Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {/* Leave Requests */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-xl flex flex-col items-center text-center transition transform hover:scale-105 hover:bg-opacity-20">
            <FaCalendarAlt className="text-green-400 text-7xl mb-4 neon-glow" />
            <h3 className="text-2xl font-bold text-gray-900">Leave Requests</h3>
            <p className="text-gray-900">View and manage your leave requests</p>
            <button
              onClick={() => navigate("/employee/my-leaves")}
              className="mt-4 px-5 py-2.5 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition transform hover:scale-105"
            >
              Manage
            </button>
          </div>

          {/* Task List */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-xl flex flex-col items-center text-center transition transform hover:scale-105 hover:bg-opacity-20">
            <FaClipboardList className="text-yellow-400 text-7xl mb-4 neon-glow" />
            <h3 className="text-2xl font-bold text-gray-900">Tasks</h3>
            <p className="text-gray-900">Check your pending tasks and deadlines</p>
            <button
              onClick={() => navigate("/employee/tasks")}
              className="mt-4 px-5 py-2.5 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition transform hover:scale-105"
            >
              View Tasks
            </button>
          </div>

          {/* Performance Chart */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-xl flex flex-col items-center text-center transition transform hover:scale-105 hover:bg-opacity-20">
            <FaChartBar className="text-purple-400 text-7xl mb-4 neon-glow" />
            <h3 className="text-2xl font-bold text-gray-900">Performance</h3>
            <p className="text-gray-900">Analyze your monthly performance stats</p>
            <button
              onClick={() => navigate("/employee/attendance-stats")}
              className="mt-4 px-5 py-2.5 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition transform hover:scale-105"
            >
              View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
