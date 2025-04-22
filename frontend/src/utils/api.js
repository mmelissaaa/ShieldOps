import axios from "axios";
import { showNotification } from './notifications';
const API_URL = "http://localhost:5000/api";

export const loginUser = async (email, password, latitude, longitude) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        latitude,
        longitude,
      });
      localStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await axios.get(`${API_URL}/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const createLeave = async (leaveData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/leaves`, leaveData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create leave:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Get all leave requests for the current user
  export const getUserLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/leaves/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification('Leaves Fetched', {
        body: `You have ${response.data.length} leave requests.`,
        icon: '/path/to/icon.png', // Optional: Add an icon
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user leaves:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Get all leave requests (for manager)
  export const getAllLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/leaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all leaves:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Update leave status (approve/reject)
  export const updateLeaveStatus = async ({ leaveId, status }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/leaves/status`,
        { leaveId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update leave status:", error.response?.data || error.message);
      throw error;
    }
  };
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };
  export const checkIn = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/attendance/check-in`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Server error' };
    }
  };
  
  // Check out function
  export const checkOut = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/attendance/check-out`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Server error' };
    }
  };
  
  // Get user attendance records
  export const getUserAttendance = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/attendance/me`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Server error' };
    }
  };
  
  // Get all attendance records (for manager)
  export const getAllAttendance = async (date = null) => {
    try {
      const url = date ? `${API_URL}/attendance?date=${date}` : API_URL;
      const response = await axios.get(
        url,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Server error' };
    }
  };
  
  // Get attendance statistics
  export const getAttendanceStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/attendance/stats`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Server error' };
    }
  };
  // Create a new task (Manager only)
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create task:", error.response?.data || error.message);
    throw error;
  }
};

// Get tasks assigned to the current user (Employee)
export const getUserTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks/me`, {
      headers: getAuthHeader(),
    });
    // Show a notification when tasks are fetched
    showNotification('Tasks Fetched', {
      body: `You have ${response.data.length} tasks.`,
      icon: '/path/to/icon.png', // Optional: Add an icon
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user tasks:", error.response?.data || error.message);
    throw error;
  }
};

// Get tasks assigned by the current user (Manager)
export const getAssignedTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks/assigned`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch assigned tasks:", error.response?.data || error.message);
    throw error;
  }
};

// Get all tasks (Manager only)
export const getAllTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all tasks:", error.response?.data || error.message);
    throw error;
  }
};

// Update task status (Employee or Manager)
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}`,
      { status },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update task status:", error.response?.data || error.message);
    throw error;
  }
};

  // Fetch all users (for manager to assign tasks)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error.response?.data || error.message);
    throw error;
  }
  
};

// Create a new complaint
export const createComplaint = async (complaintData) => {
  try {
    const response = await axios.post(`${API_URL}/complaints`, complaintData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create complaint:", error.response?.data || error.message);
    throw error;
  }
};

// Get complaints submitted by the current user
export const getUserComplaints = async () => {
  try {
    const response = await axios.get(`${API_URL}/complaints/me`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user complaints:", error.response?.data || error.message);
    throw error;
  }
};

// Get all complaints (manager only)
export const getAllComplaints = async () => {
  try {
    const response = await axios.get(`${API_URL}/complaints`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all complaints:", error.response?.data || error.message);
    throw error;
  }
};

// Add a comment to a complaint
export const addComment = async (complaintId, text) => {
  try {
    const response = await axios.post(
      `${API_URL}/complaints/${complaintId}/comment`,
      { text },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add comment:", error.response?.data || error.message);
    throw error;
  }
};

// Update complaint status (manager only)
export const updateComplaintStatus = async (complaintId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/complaints/${complaintId}/status`,
      { status },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update complaint status:", error.response?.data || error.message);
    throw error;
  }
};
// Send a new message
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, messageData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send message:", error.response?.data || error.message);
    throw error;
  }
};

// Get messages for the current user
export const getUserMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/messages`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user messages:", error.response?.data || error.message);
    throw error;
  }
};

// Get global messages
export const getGlobalMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/messages/global`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch global messages:", error.response?.data || error.message);
    throw error;
  }
};

// Get conversation with a specific user
export const getConversation = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch conversation:", error.response?.data || error.message);
    throw error;
  }
};

// Mark a message as read
export const markAsRead = async (messageId) => {
  try {
    const response = await axios.put(
      `${API_URL}/messages/read/${messageId}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to mark message as read:", error.response?.data || error.message);
    throw error;
  }
};
// Fetch all users

// Update user's last active timestamp
export const updateLastActive = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/users/active`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update last active:", error.response?.data || error.message);
    throw error;
  }
};
// utils/api.js
export const getTaskLeaderboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks/leaderboard`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error.response?.data || error.message);
    throw error;
  }
};
