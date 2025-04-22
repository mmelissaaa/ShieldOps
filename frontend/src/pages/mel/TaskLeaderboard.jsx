// import React from 'react';
// import { Trophy, ArrowUp, ArrowDown, Star } from 'lucide-react';

// const TaskLeaderboard = () => {
//   const mockTeamData = {
//     teamName: 'Team A',
//     employees: [
//       {
//         id: 1,
//         name: 'Sarah Patel',
//         tasksCompleted: 45,
//         tasksInProgress: 3,
//         performanceScore: 97,
//         weeklyTrend: 'up'
//       },
//       {
//         id: 2,
//         name: 'Emily Chen',
//         tasksCompleted: 42,
//         tasksInProgress: 5,
//         performanceScore: 95,
//         weeklyTrend: 'up'
//       },
//       {
//         id: 3,
//         name: 'Michael Rodriguez',
//         tasksCompleted: 38,
//         tasksInProgress: 7,
//         performanceScore: 88,
//         weeklyTrend: 'down'
//       },
//       {
//         id: 4,
//         name: 'David Kim',
//         tasksCompleted: 35,
//         tasksInProgress: 6,
//         performanceScore: 85,
//         weeklyTrend: 'stable'
//       },
//       {
//         id: 5,
//         name: 'Jessica Wong',
//         tasksCompleted: 41,
//         tasksInProgress: 4,
//         performanceScore: 93,
//         weeklyTrend: 'up'
//       },
//       {
//         id: 6,
//         name: 'Alex Nguyen',
//         tasksCompleted: 37,
//         tasksInProgress: 6,
//         performanceScore: 90,
//         weeklyTrend: 'up'
//       },
//       {
//         id: 7,
//         name: 'Rachel Sharma',
//         tasksCompleted: 33,
//         tasksInProgress: 5,
//         performanceScore: 87,
//         weeklyTrend: 'stable'
//       },
//       {
//         id: 8,
//         name: 'Carlos Mendez',
//         tasksCompleted: 36,
//         tasksInProgress: 7,
//         performanceScore: 86,
//         weeklyTrend: 'down'
//       }
//     ]
//   };

//   return (
//     <div className="h-screen bg-white flex flex-col">
//       <div className="flex-grow flex items-center justify-center p-4">
//         <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
//           {/* Header */}
//           <div className="bg-purple-600 text-white p-4 flex items-center">
//             <Trophy className="mr-3 h-10 w-10" />
//             <div>
//               <h1 className="text-2xl font-bold">{mockTeamData.teamName} Leaderboard</h1>
//               <p className="text-base">Task Completion Performance</p>
//             </div>
//           </div>

//           {/* Leaderboard Table */}
//           <div className="flex-grow overflow-auto">
//             <table className="w-full text-lg">
//               <thead>
//                 <tr className="bg-purple-600 text-white">
//                   <th className="p-4 text-left">Employee</th>
//                   <th className="p-4 text-center">Tasks Completed</th>
//                   <th className="p-4 text-center">Tasks In Progress</th>
//                   <th className="p-4 text-center">Performance Score</th>
//                   <th className="p-4 text-center">Trend</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {mockTeamData.employees.map((employee, index) => (
//                   <tr 
//                     key={employee.id} 
//                     className={`border-b ${index === 0 ? 'bg-yellow-50' : 'bg-white'}`}
//                   >
//                     <td className="p-4 flex items-center">
//                       {index === 0 && (
//                         <Trophy className="text-yellow-500 mr-3 h-6 w-6" />
//                       )}
//                       <span className="font-medium text-lg">{employee.name}</span>
//                     </td>
//                     <td className="p-4 text-center">{employee.tasksCompleted}</td>
//                     <td className="p-4 text-center">{employee.tasksInProgress}</td>
//                     <td className="p-4 text-center">
//                       <span className={`
//                         px-3 py-1 rounded-full text-base font-bold
//                         ${employee.performanceScore >= 90 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'}
//                       `}>
//                         {employee.performanceScore}%
//                       </span>
//                     </td>
//                     <td className="p-4 text-center">
//                       {employee.weeklyTrend === 'up' && (
//                         <ArrowUp className="text-green-500 inline h-6 w-6" />
//                       )}
//                       {employee.weeklyTrend === 'down' && (
//                         <ArrowDown className="text-red-500 inline h-6 w-6" />
//                       )}
//                       {employee.weeklyTrend === 'stable' && (
//                         <Star className="text-gray-500 inline h-6 w-6" />
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer Summary */}
//           <div className="bg-purple-50 p-5 grid grid-cols-3 gap-4 text-center">
//             <div>
//               <p className="text-base text-gray-600">Total Tasks Completed</p>
//               <p className="text-2xl font-bold text-purple-800">
//                 {mockTeamData.employees.reduce((sum, emp) => sum + emp.tasksCompleted, 0)}
//               </p>
//             </div>
//             <div>
//               <p className="text-base text-gray-600">Average Performance</p>
//               <p className="text-2xl font-bold text-purple-800">
//                 {(mockTeamData.employees.reduce((sum, emp) => sum + emp.performanceScore, 0) / mockTeamData.employees.length).toFixed(1)}%
//               </p>
//             </div>
//             <div>
//               <p className="text-base text-gray-600">Top Performer</p>
//               <p className="text-2xl font-bold text-purple-800">
//                 {mockTeamData.employees[0].name}
//               </p>
//             </div>
//           </div>
      
          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskLeaderboard;

import React, { useEffect, useState } from 'react';
import { Trophy, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { getTaskLeaderboardData } from '../../utils/api'; // Assuming you have an API function to fetch leaderboard data

const TaskLeaderboard = () => {
  const [teamData, setTeamData] = useState({
    teamName: '',
    employees: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTaskLeaderboardData(); // Fetch data from your backend
        setTeamData(data); // Update state with fetched data
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  // Display loading state while fetching data
  if (loading) {
    return <div className="h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="h-screen bg-white flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 flex items-center">
            <Trophy className="mr-3 h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold">{teamData.teamName} Leaderboard</h1>
              <p className="text-base">Task Completion Performance</p>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="flex-grow overflow-auto">
            <table className="w-full text-lg">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="p-4 text-left">Employee</th>
                  <th className="p-4 text-center">Tasks Completed</th>
                  <th className="p-4 text-center">Tasks In Progress</th>
                  <th className="p-4 text-center">Performance Score</th>
                  <th className="p-4 text-center">Trend</th>
                </tr>
              </thead>
              <tbody>
                {teamData.employees.map((employee, index) => (
                  <tr 
                    key={employee.id} 
                    className={`border-b ${index === 0 ? 'bg-yellow-50' : 'bg-white'}`}
                  >
                    <td className="p-4 flex items-center">
                      {index === 0 && (
                        <Trophy className="text-yellow-500 mr-3 h-6 w-6" />
                      )}
                      <span className="font-medium text-lg">{employee.name}</span>
                    </td>
                    <td className="p-4 text-center">{employee.tasksCompleted}</td>
                    <td className="p-4 text-center">{employee.tasksInProgress}</td>
                    <td className="p-4 text-center">
                      <span className={`
                        px-3 py-1 rounded-full text-base font-bold
                        ${employee.performanceScore >= 90 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'}
                      `}>
                        {employee.performanceScore}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {employee.weeklyTrend === 'up' && (
                        <ArrowUp className="text-green-500 inline h-6 w-6" />
                      )}
                      {employee.weeklyTrend === 'down' && (
                        <ArrowDown className="text-red-500 inline h-6 w-6" />
                      )}
                      {employee.weeklyTrend === 'stable' && (
                        <Star className="text-gray-500 inline h-6 w-6" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="bg-purple-50 p-5 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-base text-gray-600">Total Tasks Completed</p>
              <p className="text-2xl font-bold text-purple-800">
                {teamData.employees.reduce((sum, emp) => sum + emp.tasksCompleted, 0)}
              </p>
            </div>
            <div>
              <p className="text-base text-gray-600">Average Performance</p>
              <p className="text-2xl font-bold text-purple-800">
                {(teamData.employees.reduce((sum, emp) => sum + emp.performanceScore, 0) / teamData.employees.length).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-base text-gray-600">Top Performer</p>
              <p className="text-2xl font-bold text-purple-800">
                {teamData.employees[0]?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskLeaderboard;