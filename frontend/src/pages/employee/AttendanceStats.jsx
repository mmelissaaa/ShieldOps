// src/pages/employee/AttendanceStats.js
import React, { useState, useEffect } from "react";
import { getAttendanceStats } from "../../utils/api";
import EmployeeNavbar from "./EmployeeNavbar";
import moment from "moment";

const AttendanceStats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const statsData = await getAttendanceStats();
      setStats(statsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch attendance stats:", error);
      setError("Failed to load statistics. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <EmployeeNavbar />
        <div className="p-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-wide animate-pulse">
            Loading Attendance Stats...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <EmployeeNavbar />
        <div className="p-8 bg-red-500 text-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-extrabold tracking-wide">Error</h2>
          <p className="mt-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <EmployeeNavbar />
      <div className="p-8">
        <h2 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
          Attendance Statistics
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Current Streak",
              value: `${stats.currentStreak} days`,
              bg: "from-yellow-500 to-orange-600",
              icon: "🔥",
            },
            {
              title: "Longest Streak",
              value: `${stats.longestStreak} days`,
              bg: "from-blue-500 to-indigo-600",
              icon: "🏆",
            },
            {
              title: "This Week",
              value: `${stats.weeklyAttendance} days`,
              bg: "from-green-500 to-teal-600",
              icon: "📅",
            },
            {
              title: "This Month",
              value: `${stats.monthlyAttendance} days`,
              bg: "from-purple-500 to-pink-600",
              icon: "📆",
            },
            {
              title: "Bonus Points",
              value: `${stats.bonusPoints} pts`,
              bg: "from-yellow-400 to-yellow-600",
              icon: "💰",
            },
            {
              title: "Last Active",
              value: stats.lastActive
                ? moment(stats.lastActive).format("MMM DD, YYYY")
                : "N/A",
              bg: "from-gray-700 to-gray-900",
              icon: "⏳",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${stat.bg} p-6 rounded-2xl shadow-xl transition transform hover:scale-105`}
            >
              <div className="text-5xl text-center">{stat.icon}</div>
              <h3 className="text-lg font-semibold mt-4 text-center">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-center">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;
