import React, { useState, useEffect } from "react";
import ManagerNavbar from "./ManagerNavbar";
import { FiUsers, FiCalendar, FiCheckCircle, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Chatbot from "../mel/Chatbot";

const ManagerHome = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);

  useEffect(() => {
    setEmployeeCount(120);
    setPendingRequests(8);
    setApprovedLeaves(95);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <ManagerNavbar />

      <motion.div 
        className="p-10 max-w-7xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl font-extrabold neon-text tracking-widest">
           Manager Control Center 
        </h2>

        {/* Glowing Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <DashboardCard 
            title="Total Employees" 
            count={employeeCount} 
            icon={<FiUsers />} 
            color="from-blue-500 to-blue-700"
          />
          <DashboardCard 
            title="Pending Requests" 
            count={pendingRequests} 
            icon={<FiCalendar />} 
            color="from-yellow-500 to-yellow-700"
          />
          <DashboardCard 
            title="Approved Leaves" 
            count={approvedLeaves} 
            icon={<FiCheckCircle />} 
            color="from-green-500 to-green-700"
          />
        </div>

        {/* Real-Time Analytics Chart */}
        <motion.div 
          className="mt-16 bg-opacity-30 backdrop-blur-xl p-6 rounded-xl shadow-lg chart-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">
            📊 Leave Requests Trend
          </h3>
          <Line data={chartData} options={chartOptions} />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Futuristic Dashboard Card Component
const DashboardCard = ({ title, count, icon, color }) => {
  return (
    <>
      {/* <Chatbot/> */}

    <motion.div 
      className={`relative p-6 rounded-xl shadow-lg bg-gradient-to-br ${color} glass-card text-white transition-transform transform hover:scale-105`}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        
        <span className="text-6xl">{icon}</span>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-4xl font-bold">{count}</p>
        </div>
      </div>
    </motion.div>
    </>
  );
};

// Chart Data (Fake Real-Time Simulation)
const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Pending Requests",
      data: [10, 15, 12, 18, 20, 8],
      borderColor: "yellow",
      backgroundColor: "rgba(255, 255, 0, 0.2)",
      tension: 0.4,
    },
    {
      label: "Approved Leaves",
      data: [20, 25, 30, 35, 40, 50],
      borderColor: "green",
      backgroundColor: "rgba(0, 255, 0, 0.2)",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "white",
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "white" },
      grid: { color: "rgba(255,255,255,0.2)" },
    },
    y: {
      ticks: { color: "white" },
      grid: { color: "rgba(255,255,255,0.2)" },
    },
  },
};

export default ManagerHome;
