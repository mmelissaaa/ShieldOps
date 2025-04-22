import React, { useEffect, useState } from "react";
import { getAllComplaints, updateComplaintStatus } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import ManagerNavbar from "./ManagerNavbar";

const ManagerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (complaintId, status) => {
    try {
      await updateComplaintStatus(complaintId, status);
      const updatedComplaints = complaints.map((complaint) =>
        complaint._id === complaintId ? { ...complaint, status } : complaint
      );
      setComplaints(updatedComplaints);
    } catch (error) {
      console.error("Failed to update complaint status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
      <ManagerNavbar />

      <h2 className="text-3xl font-extrabold text-center mb-8 neon-text">
        All Complaints 
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-gray-700"
          >
            <h3 className="text-2xl font-semibold text-purple-400">{complaint.title}</h3>
            <p className="text-gray-400 mt-2">{complaint.description}</p>
            <p className="text-gray-300 mt-2">
              🆔 Submitted By: <span className="text-white">{complaint.submittedBy.name}</span>
            </p>
            <p className="mt-2">
              🔥 Status:{" "}
              <span className={`font-bold px-2 py-1 rounded ${complaint.status === "open" ? "bg-green-600" : complaint.status === "in-review" ? "bg-yellow-600" : complaint.status === "resolved" ? "bg-blue-600" : "bg-red-600"}`}>
                {complaint.status}
              </span>
            </p>
            <select
              value={complaint.status}
              onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
              className="mt-4 block w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 shadow-md focus:ring-2 focus:ring-purple-500 hover:bg-gray-700 transition"
            >
              <option value="open">Open</option>
              <option value="in-review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerComplaints;
