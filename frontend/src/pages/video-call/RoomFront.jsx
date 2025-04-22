import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

function RoomFront() {
  const [roomID, setRoomID] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoin = () => {
    if (roomID.trim()) {
      navigate(`/room/${roomID}`);
    } else {
      alert('Please enter a room ID.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          One-on-One Consultation
        </h1>
        <p className="text-gray-600 mb-6">
          Start or join a video call for a personalized consultation. Enter a room
          name below to begin.
        </p>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter Room Name"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJoin}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Join Room
          </button>
        </div>
        {user && (
          <p className="text-gray-500 mt-4">
            Logged in as: <span className="font-semibold">{user.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default RoomFront;