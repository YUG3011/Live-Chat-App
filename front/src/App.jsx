import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { Practice } from './login/Practice.jsx'
import { Log } from './login/Log.jsx'
 import { ToastContainer} from 'react-toastify';
 import {Route,Routes} from "react-router-dom";
import { Register } from './register/Register.jsx'
import Profile from './Profile/Profile.jsx'
import { Home } from './Home/Home.jsx'
import { VerifyUser } from './utils/VerifyUser.jsx'

// src/App.jsx



// App component that renders the login and practice components
function App() {
  const [count, setCount] = useState(0)

  return (
  <>
  
  <Routes>

    <Route path="/practice" element={<Practice/>}/>
    <Route path="/login" element={<Log/>}/>
    <Route path="/register" element={<Register/>}/>

    <Route element={<VerifyUser/>}>
       <Route path="/" element={<Home/>}/>
       <Route path="/profile/:id" element={<Profile/>} />
    </Route>
  </Routes>

  <ToastContainer theme="dark"/>
  
  {/* <Practice /> */}
  </>
  )
}

export default App
