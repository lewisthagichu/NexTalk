import { useState, useEffect } from "react"
import {useDispatch, useSelector} from 'react-redux'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { reset, login } from "../features/auth/authSlice"
import { IoIosChatbubbles } from "react-icons/io";
import defaultProfile from '../assets/profile.png'

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const {username, password} = formData
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

    function handleChange(event) {
        const {name, value} = event.target
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        
        const userData = {username, password}
        dispatch(login(userData)) 
    }

    if (isLoading) {
        return <div>Loading...</div>;
      }

    return (
        <div className="registration">
        <div className="header">
            <div>{<IoIosChatbubbles color='#508de9' size={70} />}</div>
            <h2>Sign in to your account</h2>
        </div>
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="profile-picture">
                        <img 
                            src={defaultProfile} 
                            className="profile-photo cursor-pointer"
                            alt="Profile Photo"
                            />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        name="username"
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button className='btn'>Login</button>

                <div className="redirect">
                <div>
                Dont have an account?
                <button 
                    type="button" 
                    onClick={() => navigate('../register')}
                    >Register</button>
                </div>
            </div>
            </form>
        </div>
    </div>

    )
  }
  
  export default Login