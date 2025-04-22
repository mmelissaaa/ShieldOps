import React, { useState } from "react";
import "./DailyTasks.css";

const DailyTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project report", completed: false, notes: "", priority: "medium", dueDate: "" },
    { id: 2, title: "Attend team meeting", completed: true, notes: "10:00 AM", priority: "high", dueDate: "2023-10-15" },
    { id: 3, title: "Fix bugs in the system", completed: false, notes: "", priority: "low", dueDate: "2023-10-20" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTaskItem = {
      id: tasks.length + 1,
      title: newTask,
      completed: false,
      notes: newTaskNotes,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
    };
    setTasks([...tasks, newTaskItem]);
    setNewTask("");
    setNewTaskNotes("");
    setNewTaskPriority("medium");
    setNewTaskDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditingTask = (id, title) => {
    setEditingTaskId(id);
    setEditedTaskTitle(title);
  };

  const saveEditedTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: editedTaskTitle } : task
      )
    );
    setEditingTaskId(null);
    setEditedTaskTitle("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="daily-tasks">
      <div className="container">
        <h1>Daily Tasks</h1>

        {/* Add Task Section */}
        <div className="add-task">
          <div className="form-group">
            <input
              type="text"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Add notes"
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
            />
          </div>
          <div className="form-group">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
            />
          </div>
          <button onClick={addTask}>Add Task</button>
        </div>

        {/* Filter Tasks Section */}
        <div className="filter-tasks">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("incomplete")}>Incomplete</button>
        </div>

        {/* Tasks List */}
        <ul className="tasks-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className={`task-item ${task.priority}`}>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTaskTitle}
                    onChange={(e) => setEditedTaskTitle(e.target.value)}
                    onBlur={() => saveEditedTask(task.id)}
                    onKeyPress={(e) => e.key === "Enter" && saveEditedTask(task.id)}
                  />
                ) : (
                  <span
                    className={task.completed ? "completed" : ""}
                    onClick={() => startEditingTask(task.id, task.title)}
                  >
                    {task.title}
                  </span>
                )}
                {task.notes && <p className="task-notes">Notes: {task.notes}</p>}
                {task.dueDate && (
                  <p className="task-due-date">Due: {task.dueDate}</p>
                )}
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DailyTasks;