import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import ManagerNavbar from "./ManagerNavbar";

const ManagerUsers = () => {
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
      <ManagerNavbar />

      <h2 className="text-3xl font-extrabold text-center mb-8 uppercase tracking-widest">
        All Users
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="relative bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-pink-500 hover:scale-105 transform"
          >
            <div className="absolute -top-3 -right-3 bg-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
              {user.role.toUpperCase()}
            </div>

            <div className="flex items-center space-x-4">
              {user.profilePicture ? (
                <img
                  src={`http://localhost:5000${user.profilePicture}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-pink-500 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold text-pink-400 shadow-lg">
                  {user.name.charAt(0)}
                </div>
              )}

              <div>
                <h3 className="text-xl text-black font-semibold">{user.name}</h3>
                <p className="text-black">{user.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Last Active: {new Date(user.lastActive).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-pink-500 opacity-0 hover:opacity-20 transition-all duration-300 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerUsers;
