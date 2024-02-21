import { useState } from "react"
import axios from "axios"

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const {username, password} = formData


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
        try {
            const response = await axios.post('/register', { username, password });
            // Handle successful response if needed
            console.log(response.data);
        } catch (error) {
            // Handle error
            console.error("Registration failed", error.response.data);
        }
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

            <button 
            className="bg-blue-500 text-white block w-full rounded-sm p-2"
            >Register</button>
        </form>
      </div>
    )
  }
  
  export default Register