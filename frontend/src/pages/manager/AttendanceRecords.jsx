import React, { useState, useEffect } from "react";
import { getAllAttendance, getAttendanceStats } from "../../utils/api";
import ManagerNavbar from "./ManagerNavbar";
import moment from "moment";

const AttendanceRecords = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAttendanceRecords();
    fetchAttendanceStats();
  }, [selectedDate]);

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      const records = await getAllAttendance(selectedDate);
      setAttendanceRecords(records);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
      setError("Failed to load attendance records. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      const statsData = await getAttendanceStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch attendance stats:", error);
    }
  };

  const formatTime = (dateString) => {
    return dateString ? moment(dateString).format("h:mm A") : "N/A";
  };

  const calculateHoursWorked = (checkIn, checkOut) => {
    if (!checkOut) return "In Progress";
    const duration = moment.duration(moment(checkOut).diff(moment(checkIn)));
    return `${Math.floor(duration.asHours())}h ${Math.floor(duration.asMinutes() % 60)}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <ManagerNavbar />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400">Attendance Records</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h3 className="text-lg font-semibold mb-4 md:mb-0">Filter Records</h3>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg"
              />
              <button
                onClick={() => setSelectedDate(moment().format("YYYY-MM-DD"))}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Today
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
          {isLoading ? (
            <p>Loading attendance records...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : attendanceRecords.length === 0 ? (
            <p>No attendance records found for the selected date.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-3 text-cyan-400">Employee</th>
                  <th className="py-3 text-cyan-400">Check In</th>
                  <th className="py-3 text-cyan-400">Check Out</th>
                  <th className="py-3 text-cyan-400">Hours Worked</th>
                  <th className="py-3 text-cyan-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record._id} className="border-t border-gray-600 hover:bg-gray-700">
                    <td className="py-3 flex items-center">
                      {record.user.profilePicture && (
                        <img
                          src={`http://localhost:5000${record.user.profilePicture}`}
                          alt={record.user.name}
                          className="w-10 h-10 rounded-full mr-3 border border-cyan-400"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{record.user.name}</p>
                        <p className="text-sm text-gray-400">{record.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3">{formatTime(record.checkIn)}</td>
                    <td className="py-3">{formatTime(record.checkOut)}</td>
                    <td className="py-3">{calculateHoursWorked(record.checkIn, record.checkOut)}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          record.checkOut ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                        }`}
                      >
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

export default AttendanceRecords;