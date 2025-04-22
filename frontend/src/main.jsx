import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { AuthProvider } from "./utils/AuthContext";
import { BrowserRouter } from "react-router-dom"; 
// Request notification permissions
if (Notification.permission !== 'granted') {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  });
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
