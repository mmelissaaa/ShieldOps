import React, { useEffect, useState } from "react";
import { getUserTasks, updateTaskStatus } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import EmployeeNavbar from "./EmployeeNavbar";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getUserTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <EmployeeNavbar />

      {/* Glowing Title */}
      <h2 className="text-4xl font-bold text-white tracking-wide text-center drop-shadow-lg mb-8">
         My Tasks Dashboard
      </h2>

      {/* Grid Layout for Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-900 bg-opacity-60 p-6 rounded-xl shadow-lg  backdrop-blur-md 
                       hover:shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            {/* Task Title */}
            <h3 className="text-2xl font-semibold text-white mb-2">{task.title}</h3>
            <p className="text-gray-400">{task.description}</p>

            {/* Task Meta */}
            <p className="text-gray-500 mt-2">
              Assigned By: <span className="text-yellow-300">{task.assignedBy.name}</span>
            </p>
            <p className="text-gray-500">
              Due Date: <span className="text-green-400">{new Date(task.dueDate).toLocaleDateString()}</span>
            </p>

            {/* Task Status */}
            <p
              className={`mt-2 text-lg font-semibold ${
                task.status === "todo"
                  ? "text-yellow-300"
                  : task.status === "in-progress"
                  ? "text-purple-400"
                  : "text-green-400"
              }`}
            >
              Status: {task.status.toUpperCase()}
            </p>

            {/* Status Dropdown */}
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task._id, e.target.value)}
              className="mt-4 p-2 w-full border border-cyan-400 text-cyan-300 bg-gray-900 rounded-lg hover:ring-2 hover:ring-cyan-500 transition"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTasks;
