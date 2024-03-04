/* eslint-disable react/no-unknown-property */
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import io from 'socket.io-client'

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [socket,setSocket] = useState(null)

  const {user, isError, message} = useSelector(state => state.auth)

  useEffect(() => {
    if (isError) {
        console.log(message);
    }

    if (!user) {
        navigate('/register');
    }
}, [isError, message, user, navigate])

  useEffect(()=> {
    const {token} = user
  
    const socket = io.connect('http://localhost:5000', { 
      auth: {
        token
      }})

      return () => {
        socket.disconnect()
      }

  }, [])



  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">contacts</div>

      <div className="bg-blue-100 w-2/3 p-2 flex flex-col">
        <div className="flex-grow">
          messages with selected persons
        </div>

        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Type your message here"
            className="bg-white flex-grow border rounded-sm p-2"/>
          <button className="bg-blue-500 p-2 text-white rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}

export default Profile