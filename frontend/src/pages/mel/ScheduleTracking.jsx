import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCheckCircle, FaTimesCircle, FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import { getUserTasks } from "../../utils/api";
import EmployeeNavbar from "../employee/EmployeeNavbar";

const localizer = momentLocalizer(moment);
Modal.setAppElement("#root");

const ScheduleTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getUserTasks();
        const formattedTasks = tasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          status: task.status,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskTitle || !taskStartTime || !taskEndTime) {
      alert("Please fill in all required fields.");
      return;
    }

    resetModalState();
  };

  const resetModalState = () => {
    setIsModalOpen(false);
    setTaskTitle("");
    setTaskStartTime("");
    setTaskEndTime("");
    setTaskDescription("");
    setTaskPriority("medium");
  };

  const eventStyleGetter = (event) => {
    const backgroundColor =
      event.priority === "high" ? "#DC2626" : event.priority === "medium" ? "#3B82F6" : "#22C55E";

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        color: "white",
        padding: "5px",
        border: "none",
      },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-black p-6">
      <EmployeeNavbar/>
      <h1 className="text-3xl text-white font-bold text-center mb-6">Schedule Tracking</h1>
      <div className="bg-gray-700 rounded-lg shadow-lg p-4">
        <Calendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          onSelectSlot={({ start }) => handleDateClick(start)}
          selectable
          className="rounded-lg"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={resetModalState}
        contentLabel="Add Task"
        className="p-6 bg-gray-800 text-black rounded-lg shadow-lg w-96 mx-auto z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-black"
            required
          />
          <textarea
            placeholder="Task Description (Optional)"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-black"
          />
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-black"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex space-x-4">
            <input
              type="time"
              value={taskStartTime}
              onChange={(e) => setTaskStartTime(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-black"
              required
            />
            <input
              type="time"
              value={taskEndTime}
              onChange={(e) => setTaskEndTime(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-black"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">Add Task</button>
            <button type="button" onClick={resetModalState} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ScheduleTracking;
