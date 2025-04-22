import React, { useEffect, useState } from "react";
import { getUserComplaints } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import EmployeeNavbar from "./EmployeeNavbar";

const EmployeeComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getUserComplaints();
        setComplaints(data);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <EmployeeNavbar />

      <h2 className="text-3xl font-bold mb-6 text-center tracking-wide uppercase">
        My Complaints
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-xl transition transform hover:scale-105 hover:bg-opacity-20"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{complaint.title}</h3>
            <p className="text-gray-800">{complaint.description}</p>
            <p
              className={`mt-3 px-3 py-1 inline-block rounded-lg text-sm font-medium ${
                complaint.status === "Resolved"
                  ? "bg-green-600 text-green-100"
                  : "bg-yellow-600 text-yellow-100"
              }`}
            >
              Status: {complaint.status}
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              Submitted On: {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeComplaints;
