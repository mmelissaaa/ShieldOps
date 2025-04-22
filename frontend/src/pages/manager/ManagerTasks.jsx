import React, { useEffect, useState } from "react";
import { getAllTasks } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import ManagerNavbar from "./ManagerNavbar";

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white font-mono p-8">
      <ManagerNavbar />

      <h2 className="text-3xl font-extrabold text-glow mb-6 text-center"> Task Management Dashboard </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-gray-800 p-6 rounded-xl shadow-neon transform transition duration-300 hover:scale-105 hover:shadow-neonGlow">
            <h3 className="text-xl font-semibold text-neonBlue">{task.title}</h3>
            <p className="text-gray-400 mt-2">{task.description}</p>
            <p className="text-neonGreen mt-2">👤 Assigned To: {task.assignedTo.name}</p>
            <p className="text-neonYellow mt-2">📌 Status: {task.status}</p>
            <p className="text-neonPink mt-2">📅 Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerTasks;
