import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import Register from "./pages/Register"
import Chat from './pages/Chat'

function App() {
  axios.defaults.baseURL = "http://localhost:5000"
  axios.defaults.withCredentials = true
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Chat />}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
    </Router>
    <ToastContainer />      
    </>
  )
}

export default App
