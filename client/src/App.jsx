import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './css/app.css';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import Register from "./pages/Register"
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  axios.defaults.baseURL = "http://localhost:5000"
  axios.defaults.withCredentials = true
  return (
    <>
      <Router>        
        <Routes>   
          <Route path='/' element={<Profile />}/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />          
        </Routes>       
      </Router>
      <ToastContainer />      
    </>
  )
}

export default App
