import React, { useState } from 'react';
import { Calendar, User, BarChart3, Clock, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DaysOff = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("John Doe");

  // Sample employee attendance data
  const attendanceData = {
    "John Doe": {
      daysOff: ["2025-03-05", "2025-03-06", "2025-03-12", "2025-03-19", "2025-03-26"],
      monthlyStats: [
        { day: '1', attendance: 100, workHours: 8 },
        { day: '5', attendance: 0, workHours: 0 },
        { day: '10', attendance: 100, workHours: 9 },
        { day: '15', attendance: 100, workHours: 8.5 },
        { day: '20', attendance: 0, workHours: 0 },
        { day: '25', attendance: 100, workHours: 7.5 },
        { day: '30', attendance: 100, workHours: 8 },
      ]
    }
  };

  // Calculate stats
  const totalDays = 30; // Assuming a 30-day month for simplicity
  const daysOffCount = attendanceData[selectedEmployee].daysOff.length;
  const daysPresent = totalDays - daysOffCount;
  const attendanceRate = ((daysPresent / totalDays) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Employee Attendance</h1>
              <p className="text-gray-500">Track work days and leave</p>
            </div>
          </div>

          <div className="flex items-center bg-purple-100 rounded-xl p-2 space-x-2">
            <User className="h-5 w-5 text-purple-600" />
            <select
              className="bg-transparent text-purple-800 font-medium focus:outline-none"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="John Doe">John Doe</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Days Present Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-2">Days Present</p>
                <p className="text-3xl font-bold text-green-600">{daysPresent}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
          </div>

          {/* Days Off Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-2">Days Off</p>
                <p className="text-3xl font-bold text-red-600">{daysOffCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${100 - attendanceRate}%` }}
              ></div>
            </div>
          </div>

          {/* Attendance Rate Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-2">Attendance Rate</p>
                <p className="text-3xl font-bold text-purple-600">{attendanceRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Graphs */}
        <div className="space-y-6">
          {/* Monthly Attendance Graph */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Attendance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={attendanceData[selectedEmployee].monthlyStats}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                  <XAxis dataKey="day" stroke="#7e22ce" />
                  <YAxis stroke="#7e22ce" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#8B5CF6',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorAttendance)"
                    strokeWidth={2}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#6D28D9' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Working Hours Graph */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Working Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={attendanceData[selectedEmployee].monthlyStats}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                  <XAxis dataKey="day" stroke="#7e22ce" />
                  <YAxis stroke="#7e22ce" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#8B5CF6',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="workHours"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: 'white', stroke: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#6D28D9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaysOff;