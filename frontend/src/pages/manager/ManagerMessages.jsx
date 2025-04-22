import React, { useEffect, useState } from "react";
import { getUserMessages, getGlobalMessages, markAsRead } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import ManagerNavbar from "./ManagerNavbar";

const ManagerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userMessages = await getUserMessages();
        const globalMessages = await getGlobalMessages();
        setMessages(userMessages);
        setGlobalMessages(globalMessages);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
      <ManagerNavbar />

      <h2 className="text-3xl font-extrabold text-center mb-8 neon-text">💬 My Messages 💬</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl backdrop-blur-md border ${
              message.isRead
                ? "bg-gray-800/50 border-gray-700"
                : "bg-red-700/50 border-red-500 shadow-red-500/50"
            }`}
          >
            <h3 className="text-2xl font-semibold text-purple-400">{message.sender.name}</h3>
            <p className="text-gray-300 mt-2">{message.content}</p>
            <p className="mt-2">
              🔥 Status:{" "}
              <span className={`font-bold px-2 py-1 rounded ${message.isRead ? "bg-green-600" : "bg-red-600"}`}>
                {message.isRead ? "Read" : "Unread"}
              </span>
            </p>
            {!message.isRead && (
              <button
                onClick={() => handleMarkAsRead(message._id)}
                className="mt-4 w-full p-2 rounded-lg bg-blue-600 text-white text-lg font-semibold transition-all transform hover:scale-105 hover:bg-blue-700 shadow-md"
              >
                ✅ Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-extrabold text-center mt-12 mb-6 neon-text">🌍 Global Messages 🌍</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {globalMessages.map((message) => (
          <div
            key={message._id}
            className="p-6 rounded-2xl shadow-lg bg-gray-800/50 border border-gray-700 backdrop-blur-md transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-yellow-400">{message.sender.name}</h3>
            <p className="text-gray-300 mt-2">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerMessages;
