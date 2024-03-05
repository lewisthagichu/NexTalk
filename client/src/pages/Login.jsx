import { useState, useEffect } from "react"
import {useDispatch, useSelector} from 'react-redux'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { reset, login } from "../features/auth/authSlice"

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
      <div className="bg-blue-50 h-screen flex items-center">
        <form onSubmit={handleSubmit} className="w-64 mx-auto mb-12" >
            <input 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            type="text" 
            placeholder="username" 
            className="block w-full rounded-sm p-2 mb-2 border"/>

            <input 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            type="password" 
            placeholder="password" 
            className="block w-full rounded-sm p-2 mb-2 border" />

            <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                Login
            </button>

            <div className="text-center mt-2">
                <div>
                Dont have an account?
                <button 
                    type="button" 
                    className="ml-1" 
                    onClick={() => navigate('../register')}
                    >Register</button>
                </div>
            </div>
        </form>
      </div>

    )
  }
  
  export default Login