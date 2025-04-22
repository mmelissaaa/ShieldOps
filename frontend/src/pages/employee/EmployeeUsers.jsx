import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import EmployeeNavbar from "./EmployeeNavbar";

const EmployeeUsers = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <EmployeeNavbar />

      {/* Glowing Title */}
      <h2 className="text-4xl font-bold text-cyan-400 tracking-wide text-center drop-shadow-lg mb-8">
         All Users Dashboard
      </h2>

      {/* Grid Layout for Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-900 bg-opacity-60 p-6 rounded-xl shadow-lg shadow-cyan-500/50 backdrop-blur-lg 
                       hover:shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <div className="flex items-center space-x-4">
              {/* Profile Picture or Initial */}
              {user.profilePicture ? (
                <img
                  src={`http://localhost:5000${user.profilePicture}`}
                  alt={user.name}
                  className="w-14 h-14 rounded-full border-2 border-cyan-400 shadow-lg 
                             hover:ring-4 hover:ring-cyan-500 transition-transform hover:scale-110"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center 
                                text-cyan-300 text-xl font-bold border-2 border-cyan-400 shadow-lg">
                  {user.name.charAt(0)}
                </div>
              )}

              {/* User Details */}
              <div>
                <h3 className="text-2xl font-semibold text-cyan-300">{user.name}</h3>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Role: <span className="text-yellow-300">{user.role}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeUsers;
