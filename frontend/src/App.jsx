import React from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";

// Authentication Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Employee Pages
import EmployeeHome from "./pages/employee/EmployeeHome";
import RequestLeave from "./pages/employee/RequestLeave";
import MyLeaves from "./pages/employee/MyLeaves";

// Manager Pages
import ManagerHome from "./pages/manager/ManagerHome";
import LeaveRequests from "./pages/manager/LeaveRequests";
import AttendanceTracker from "./pages/employee/AttendanceTracker";
import AttendanceStats from "./pages/employee/AttendanceStats";
import AttendanceRecords from "./pages/manager/AttendanceRecords";
import EmployeeTasks from "./pages/employee/EmployeeTasks";
import ManagerTasks from "./pages/manager/ManagerTasks";
import CreateTask from "./pages/manager/CreateTasks";
import EmployeeComplaints from "./pages/employee/EmployeeComplaints";
import SubmitComplaint from "./pages/employee/SubmitComplaint";
import ManagerComplaints from "./pages/manager/ManagerComplaints";
import EmployeeMessages from "./pages/employee/EmployeeMessage";
import SendMessage from "./pages/employee/SendMessage";
import ManagerMessages from "./pages/manager/ManagerMessages";
import EmployeeUsers from "./pages/employee/EmployeeUsers";
import ManagerUsers from "./pages/manager/ManagerUsers";
import RoomFront from "./pages/video-call/RoomFront";
import Room from "./pages/video-call/Room";
import Chatbot from "./pages/mel/Chatbot";
// import DailyTasks from "./pages/mel/DailyTasks";
import DaysOff from "./pages/mel/DaysOff";
import EmployeeAnalysis from "./pages/mel/EmployeeAnalysis";
import FraudDetection from "./pages/mel/FraudDetection";
import ScheduleTracking from "./pages/mel/ScheduleTracking";
import TaskLeaderboard from "./pages/mel/TaskLeaderboard";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking auth state
  }

  return (
  <>
      <Chatbot/>
  

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Root Route - Redirect based on role */}
        <Route path="/" element={
          user ? (
            user.role === "manager" ? <Navigate to="/manager/home" /> : <Navigate to="/employee/home" />
          ) : <Navigate to="/login" />
        } />

        {/* Employee Routes */}
        <Route path="/employee/home" element={<EmployeeHome />} />
        <Route path="/employee/request-leave" element={<RequestLeave />} />
        <Route path="/employee/my-leaves" element={<MyLeaves />} />
        <Route path="/employee/attendance" element={<AttendanceTracker />} />
        <Route path="/employee/attendance-stats" element={<AttendanceStats />} />
        <Route path="/employee/tasks" element={<EmployeeTasks />} />
        <Route path="/employee/complaints" element={<EmployeeComplaints />} />
        <Route path="/employee/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/employee/messages" element={<EmployeeMessages />} />
        <Route path="/employee/send-message" element={<SendMessage />} />
        <Route path="/employee/users" element={<EmployeeUsers />} />
        <Route path="/meltask1" element={<DaysOff />} />
        {/* <Route path="/meltask" element={<EmployeeAnalysis />} /> */}
        <Route path="/calender" element={<ScheduleTracking />} />
        <Route path="/meltask" element={<TaskLeaderboard />} />





        {/* Manager Routes */}
        <Route path="/manager/home" element={<ManagerHome />} />
        <Route path="/manager/leave-requests" element={<LeaveRequests />} />
        <Route path="/manager/attendance-records" element={<AttendanceRecords />} />
        <Route path="/manager/tasks" element={<ManagerTasks />} />
        <Route path="/manager/create-task" element={<CreateTask />} />
        <Route path="/manager/complaints" element={<ManagerComplaints />} />
        <Route path="/manager/messages" element={<ManagerMessages />} />
        <Route path="/manager/users" element={<ManagerUsers />} />

{/* Video Call Routes */}
<Route path="/roomfront" element={<RoomFront />} />
      <Route path="/room/:roomID" element={<Room />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </>
  );
};

export default App;
