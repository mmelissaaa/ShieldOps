import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import EmployeeNavbar from "./EmployeeNavbar";

const SubmitComplaint = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComplaint({ title, description });
      navigate("/employee/complaints");
    } catch (error) {
      console.error("Failed to submit complaint:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-8">
      <EmployeeNavbar />

      <div className="max-w-lg w-full bg-white bg-opacity-10 backdrop-blur-lg shadow-lg p-8 rounded-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6"> Submit a Complaint</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-gray-900 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md hover:shadow-blue-500 transition duration-300"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-gray-800 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md hover:shadow-blue-500 transition duration-300"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-blue-500"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
