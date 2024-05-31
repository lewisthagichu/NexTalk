import './css/app.css';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ChatContextProvider } from './context/ChatContext';

function App() {
  axios.defaults.baseURL = 'http://localhost:5000';
  axios.defaults.withCredentials = true;

  return (
    <ChatContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ChatContextProvider>
  );
}

export default App;
