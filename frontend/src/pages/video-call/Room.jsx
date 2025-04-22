import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

function Room() {
  const { roomID } = useParams();
  const { user } = useAuth();
  const meetingRef = useRef(null); // Ref to track if the meeting has started

  useEffect(() => {
    if (meetingRef.current) return; // Prevent multiple calls

    const myMeeting = async (element) => {
      const appID = 1706262848; // Replace with your ZegoCloud App ID
      const serverSecret = '3122e3c5961a4142eb99a05b607dcfb8'; // Replace with your ZegoCloud Server Secret
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date.now().toString(),
        user?.name || 'User' // Use the logged-in user's name or a default name
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Share link',
            url: `http://localhost:5173/room/${roomID}`, // Update with your app's URL (Vite uses port 5173)
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 call mode
        },
        showPreJoinView: false, // Disable pre-join screen for a smoother experience
        showRoomDetailsButton: true, // Show room details
        showLeavingView: true, // Show leaving confirmation
        showUserList: true, // Show the list of participants
        showMicrophoneButton: true, // Show microphone toggle
        showCameraButton: true, // Show camera toggle
        showScreenSharingButton: true, // Show screen sharing button
        showTextChat: true, // Enable text chat
        showTurnOffRemoteCameraButton: true, // Allow turning off remote camera
        showTurnOffRemoteMicrophoneButton: true, // Allow muting remote microphone
      });

      meetingRef.current = true; // Mark the meeting as started
    };

    myMeeting(document.getElementById('meeting-container'));

    // Cleanup function
    return () => {
      meetingRef.current = false; // Reset the meeting state
    };
  }, [roomID, user?.name]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Video Call Room: {roomID}</h1>
        <p className="text-gray-400">You are now in the video call room.</p>
      </div>
      <div
        id="meeting-container"
        className="w-full h-[80vh] max-w-6xl bg-gray-800 rounded-lg overflow-hidden"
      ></div>
    </div>
  );
}

export default Room;