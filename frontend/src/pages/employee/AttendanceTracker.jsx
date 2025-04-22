import React, { useState, useEffect } from "react";
import { checkIn, checkOut, getUserAttendance } from "../../utils/api";
import EmployeeNavbar from "./EmployeeNavbar";
import moment from "moment";

const AttendanceTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      const records = await getUserAttendance();
      setAttendanceRecords(records);
      const today = moment().startOf("day");
      const todayRecord = records.find(record => moment(record.date).isSame(today, "day"));
      setTodayRecord(todayRecord);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Failed to load attendance data. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      await checkIn();
      setSuccessMessage("Check-in successful!");
      fetchAttendanceData();
    } catch (error) {
      setErrorMessage("Check-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      await checkOut();
      setSuccessMessage("Check-out successful!");
      fetchAttendanceData();
    } catch (error) {
      setErrorMessage("Check-out failed. Please try again.");
      setIsLoading(false);
    }
  };

  const formatTime = dateString => moment(dateString).format("h:mm A");
  const calculateHoursWorked = (checkIn, checkOut) => {
    if (!checkOut) return "Still working";
    const duration = moment.duration(moment(checkOut).diff(moment(checkIn)));
    return `${Math.floor(duration.asHours())}h ${Math.floor(duration.asMinutes() % 60)}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <EmployeeNavbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Attendance Tracker
        </h2>
        
        <div className="bg-gray-800/70 shadow-2xl backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-400">Today's Status</h3>
          {todayRecord ? (
            <div>
              <p>Check-in: {formatTime(todayRecord.checkIn)}</p>
              {todayRecord.checkOut && <p>Check-out: {formatTime(todayRecord.checkOut)}</p>}
              <p className="font-medium mt-2">Hours worked: {calculateHoursWorked(todayRecord.checkIn, todayRecord.checkOut)}</p>
            </div>
          ) : (
            <p className="text-gray-400">Not checked in yet today.</p>
          )}
          <div className="flex mt-4 space-x-4">
            <button onClick={handleCheckIn} disabled={isLoading || todayRecord} className="px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-500 transition-all transform hover:scale-105">
              Check In
            </button>
            <button onClick={handleCheckOut} disabled={isLoading || !todayRecord || todayRecord?.checkOut} className="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-500 transition-all transform hover:scale-105">
              Check Out
            </button>
          </div>
        </div>

        {successMessage && <div className="bg-green-500/30 text-green-300 p-3 rounded-lg mb-4">{successMessage}</div>}
        {errorMessage && <div className="bg-red-500/30 text-red-300 p-3 rounded-lg mb-4">{errorMessage}</div>}

        <div className="bg-gray-800/70 shadow-2xl backdrop-blur-lg rounded-xl p-6 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-400">Attendance History</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : attendanceRecords.length === 0 ? (
            <p className="text-gray-400">No attendance records found.</p>
          ) : (
            <table className="w-full border-collapse border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Hours Worked</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => (
                  <tr key={record._id} className="border-t border-gray-600 hover:bg-gray-700 transition">
                    <td className="py-3 px-4">{moment(record.date).format("MMM DD, YYYY")}</td>
                    <td className="py-3 px-4">{formatTime(record.checkIn)}</td>
                    <td className="py-3 px-4">{record.checkOut ? formatTime(record.checkOut) : "Not checked out"}</td>
                    <td className="py-3 px-4">{calculateHoursWorked(record.checkIn, record.checkOut)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${record.checkOut ? "bg-green-400 text-white" : "bg-yellow-400 text-white"}`}>
                        {record.checkOut ? "Complete" : "In Progress"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;