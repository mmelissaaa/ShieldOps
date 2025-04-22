import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage, getAllUsers } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import EmployeeNavbar from "./EmployeeNavbar";

const SendMessage = () => {
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({ content, receiver, isGlobal });
      navigate("/employee/messages");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center p-10">
      <EmployeeNavbar />
      <div className="max-w-2xl w-full bg-gray-900 bg-opacity-80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center animate-pulse">📩 Send a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium">Message Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none hover:shadow-lg transition-all"
              placeholder="Write your message here..."
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium">Receiver</label>
            <select
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none hover:shadow-lg transition-all"
              disabled={isGlobal}
              required={!isGlobal}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-3 text-gray-300 font-medium">Send as Global Message?</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
             Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
