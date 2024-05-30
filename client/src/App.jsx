import { useState, useMemo } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './css/app.css';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { ChatContext } from './context/ChatContext';
import Register from "./pages/Register"
import Login from './pages/Login'
import Chat from './pages/Chat'

function App() {
  axios.defaults.baseURL = "http://localhost:5000"
  axios.defaults.withCredentials = true

  const [notifications, setNotifications] = useState([])

  const value = useMemo(() => ({notifications, setNotifications}), [notifications, setNotifications])
  return (
    <ChatContext.Provider value={value}>
      <Router>        
        <Routes>   
          <Route path='/' element={<Chat />}/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />          
        </Routes>       
      </Router>
      <ToastContainer />      
    </ChatContext.Provider>
  )
}

export default App
