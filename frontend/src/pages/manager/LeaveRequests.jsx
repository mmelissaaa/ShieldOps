import React, { useState, useEffect } from "react";
import { getAllLeaves, updateLeaveStatus } from "../../utils/api";
import ManagerNavbar from "./ManagerNavbar";

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const leavesData = await getAllLeaves();
      setLeaves(leavesData);
    } catch (error) {
      console.error("🚨 Error fetching leaves:", error);
    }
  };

  const handleApproveReject = async (leaveId, status) => {
    try {
      await updateLeaveStatus({ leaveId, status });
      alert(`🔥 Leave request ${status.toUpperCase()}!`);
      fetchLeaves();
    } catch (error) {
      console.error("⚠️ Error updating leave status:", error);
      alert("❌ Could not update leave status. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white font-mono">
      <ManagerNavbar />
      <div className="p-8">
        <h2 className="text-3xl font-extrabold text-glow mb-6"> Leave Requests Dashboard </h2>
        <div className="bg-darkCard p-6 rounded-xl shadow-neon">
          <table className="w-full border-collapse border-neon">
            <thead>
              <tr className="text-white border-b border-neon">
                <th className="text-left p-2">EMPLOYEE</th>
                <th className="text-left p-2">FROM</th>
                <th className="text-left p-2">TO</th>
                <th className="text-left p-2">REASON</th>
                <th className="text-left p-2">STATUS</th>
                <th className="text-left p-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} className="border-b border-neon">
                  <td className="flex items-center p-2 space-x-3">
                    <img
                      src={`http://localhost:5000${leave.user.profilePicture}`}
                      alt={leave.user.name}
                      className="w-12 h-12 rounded-full border-2 border-neonPink"
                    />
                    <div className="flex flex-row space-x-2 text-white">
                      <p className="font-bold">{leave.user.name}</p>
                      <p className="text-sm">({leave.user.email})</p>
                    </div>
                  </td>
                  <td className="p-2 text-white">{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td className="p-2 text-white">{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td className="p-2 text-white">{leave.reason}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase text-white ${
                        leave.status === "approved"
                          ? "bg-neonGreen"
                          : leave.status === "rejected"
                          ? "bg-neonRed"
                          : "bg-neonYellow"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {leave.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveReject(leave._id, "approved")}
                          className="bg-neonGreen text-white px-4 py-2 rounded-lg hover:shadow-neonGlow"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleApproveReject(leave._id, "rejected")}
                          className="bg-neonRed text-white px-4 py-2 rounded-lg hover:shadow-neonGlow"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;