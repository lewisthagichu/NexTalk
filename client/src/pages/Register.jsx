import '../css/Registration.css'; 
import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { reset, register } from "../features/auth/authSlice"
import { IoIosChatbubbles } from "react-icons/io";
import convertToBase64 from '../utils/converttobase64';
import defaultProfile from '../assets/profile.png'

function Register() {
  // State variables to hold form data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const {user, isSuccess, isLoading, isError, message} = useSelector(state => state.auth)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=> {
    if (isError) toast.error(message)

    if (isSuccess || user) {
        navigate('/')
    }

    dispatch(reset())
}, [user, isError, isSuccess, message, navigate, dispatch])

// Function to handle profile picture change
async function handleProfileChange(e) {
    const file = e.target.files[0]
    const base64 = await convertToBase64(file)
    setProfilePicture(base64)
}

// Function to handle form submission
function handleSubmit(e) {
    e.preventDefault();

    const userData = {username, password, profilePicture}

    // Send registration data to the server
    dispatch(register(userData))
}

if (isLoading) {
    return <div>Loading...</div>;
}

return (
    <div className="registration">
        <div className="header">
            <div>{<IoIosChatbubbles color='#508de9' size={70} />}</div>
            <h2>Sign up to Connect</h2>
        </div>
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="profile-picture">
                        <img 
                            src={profilePicture || defaultProfile} 
                            className="profile-photo cursor-pointer"
                            alt="Profile Photo"
                            />
                    </label>
                    <input
                        type="file"
                        id="profile-picture"
                        accept='.jpeg, .png, .jpg'
                        onChange={(e) => handleProfileChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Confirm Password</label>
                    <input
                        type="password"
                        id="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='btn'>Register</button>

                <div className="redirect">            
                    <div>
                    Already a member?
                    <button 
                        type="button" 
                        onClick={() => navigate('../login')}
                        >Login here</button>
                    </div>
                 </div>
            </form>
        </div>
    </div>
  );
}

export default Register;
