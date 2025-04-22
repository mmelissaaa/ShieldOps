import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./EmployeeAnalysis.css"; // Ensure CSS is present

const EmployeeAnalysis = () => {
  const [employees, setEmployees] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("./dummy_employee_data.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            const processedData = processEmployeeData(result.data);
            setEmployees(processedData);
            setAnomalies(detectAnomalies(processedData));
            setLoading(false);
          },
        });
      });
  }, []);

  const processEmployeeData = (data) => {
    return data.map((employee) => ({
      ...employee,
      Attendance_Rate: ((employee.Attendance_Days / 260) * 100).toFixed(2),
      Leave_Usage: ((employee.Leaves_Taken / 30) * 100).toFixed(2),
    }));
  };

  const detectAnomalies = (data) => {
    return data.filter((emp) => emp.Attendance_Rate < 60 || emp.Leaves_Taken > 25);
  };

  return (
    <div className="analysis-container">
      <h2>Employee Attendance & Leave Analysis</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Employee Data Table
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Attendance Rate (%)</th>
                <th>Leaves Taken</th>
                <th>Remaining Leaves</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index}>
                  <td>{emp.Employee_ID}</td>
                  <td>{emp.Name}</td>
                  <td>{emp.Department}</td>
                  <td>{emp.Attendance_Rate}%</td>
                  <td>{emp.Leaves_Taken}</td>
                  <td>{emp.Remaining_Leaves}</td>
                </tr>
              ))}
            </tbody>
          </table> */}

          {/* Anomaly Data Table */}
          <h3>Anomalies Detected</h3>
          {anomalies.length === 0 ? (
            <p>No anomalies found.</p>
          ) : (
            <table className="anomaly-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Attendance Rate (%)</th>
                  <th>Leaves Taken</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.Employee_ID}</td>
                    <td>{emp.Name}</td>
                    <td>{emp.Attendance_Rate}%</td>
                    <td>{emp.Leaves_Taken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Anomaly Visualization */}
          <h3>Graph: Employee Attendance & Anomalies</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={employees.slice(0, 20)}> {/* Show top 20 for readability */}
              <XAxis dataKey="Name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Attendance_Rate" fill="#6a0dad" name="Attendance Rate (%)" />
              <Bar dataKey="Leaves_Taken" fill="red" name="Leaves Taken" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default EmployeeAnalysis;
