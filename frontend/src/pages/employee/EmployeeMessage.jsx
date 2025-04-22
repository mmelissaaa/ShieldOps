import React, { useEffect, useState } from "react";
import { getUserMessages, markAsRead } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import EmployeeNavbar from "./EmployeeNavbar";
import { FaEnvelope, FaEnvelopeOpen, FaUserCircle } from "react-icons/fa";

const EmployeeMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getUserMessages();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
      const updatedMessages = messages.map((message) =>
        message._id === messageId ? { ...message, isRead: true } : message
      );
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex flex-col">
      <EmployeeNavbar />

      <h2 className="text-4xl font-extrabold text-center text-cyan-400 neon-glow mb-8 tracking-wider">
        📩 My Messages
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`relative p-6 rounded-2xl shadow-lg backdrop-blur-md transition-transform transform hover:scale-105 
            ${message.isRead ? "bg-gray-800 border border-gray-600" : "bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500"}`}
          >
            {/* Sender Avatar & Name */}
            <div className="flex items-center mb-4">
              <FaUserCircle className="text-5xl text-cyan-300 mr-3 shadow-lg" />
              <h3 className="text-lg font-semibold text-gray-200">{message.sender.name}</h3>
            </div>

            {/* Message Content */}
            <p className="text-gray-200 text-sm bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg">
              {message.content}
            </p>

            {/* Status & Actions */}
            <div className="mt-4 flex justify-between items-center">
              <p
                className={`text-sm flex items-center font-semibold ${
                  message.isRead ? "text-green-400" : "text-yellow-300"
                }`}
              >
                {message.isRead ? <FaEnvelopeOpen className="mr-2" /> : <FaEnvelope className="mr-2" />}
                {message.isRead ? "Read" : "Unread"}
              </p>

              {!message.isRead && (
                <button
                  onClick={() => handleMarkAsRead(message._id)}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-110"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeMessages;
