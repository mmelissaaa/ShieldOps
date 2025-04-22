import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { createLeave } from "../../utils/api";
import EmployeeNavbar from "./EmployeeNavbar";

const RequestLeave = () => {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeave({ fromDate, toDate, reason });
      alert("Leave request submitted successfully!");
      setFromDate("");
      setToDate("");
      setReason("");
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      alert("Failed to submit leave request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center">
      <EmployeeNavbar />
      <div className="p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
           Request a Leave
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-2xl border border-gray-700"
        >
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-medium mb-2">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-medium mb-2">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 text-sm font-medium mb-2">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
             Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestLeave;
