import React, { useState, useEffect } from "react";
import { getUserLeaves } from "../../utils/api";
import EmployeeNavbar from "./EmployeeNavbar";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const leavesData = await getUserLeaves();
      setLeaves(leavesData);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <EmployeeNavbar />

      {/* Glassmorphic Container */}
      <div className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-gray-900 bg-opacity-60 backdrop-blur-lg shadow-lg shadow-cyan-500/50 
                        rounded-xl p-8 max-w-5xl mx-auto border border-cyan-500">
          <h2 className="text-4xl font-bold text-cyan-400 tracking-wide text-center drop-shadow-lg mb-8">
             Your Leave Requests
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-cyan-700 text-white text-lg">
                  <th className="px-6 py-4 text-left">From Date</th>
                  <th className="px-6 py-4 text-left">To Date</th>
                  <th className="px-6 py-4 text-left">Reason</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr
                      key={leave._id}
                      className="border-b border-gray-700 hover:bg-gray-800 hover:scale-105 transition-all"
                    >
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(leave.toDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{leave.reason}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide shadow-md 
                                      animate-pulse ${
                                        leave.status === "approved"
                                          ? "bg-green-600 text-green-100 shadow-green-400/50"
                                          : leave.status === "rejected"
                                          ? "bg-red-600 text-red-100 shadow-red-400/50"
                                          : "bg-yellow-600 text-yellow-100 shadow-yellow-400/50"
                                      }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLeaves;
