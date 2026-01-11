import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router } from'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
  <AuthContextProvider>
  <SocketContextProvider>

    <App />
    
  </SocketContextProvider>
  </AuthContextProvider>
 
  </Router>

)
