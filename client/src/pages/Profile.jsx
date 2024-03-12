/* eslint-disable react/no-unknown-property */
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaRocketchat, FaUber } from "react-icons/fa6"
import {uniqBy} from 'lodash'
import io from 'socket.io-client'
import Avatar from "../components/Avatar"
import { createMessage, getMessages, reset } from "../features/messages/messagesSlice"

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [socket,setSocket] = useState(null)
  const [activeUsers, setActiveUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [currentRoom, setCurrentRoom] = useState(null)
  // const [messages, setMessages] = useState([])
  const inputRef = useRef()
  const divRef = useRef()

  const {user} = useSelector(state => state.auth)
  const {messages, isLoadng, isError, message} = useSelector(state => state.messages)

  // Check if user is authorized
  useEffect(() => {  
    if (!user) {
        navigate('/register');
    }
  }, [ user, navigate])


  useEffect(()=> {
    // Proceed with the rest of the component logic only if the user is authenticated
    if (user) {
      // Make a socket connection
      connectSocket()
  }
  }, [])
  
  // Connect to server
  function connectSocket() {
    const { token } = user;
  
      // Connect socket with authentication token
      const socket = io.connect("http://localhost:5000", {
        auth: {
          token,
        },
      });

      setSocket(socket);

      // Receive active/connected users
      socket.on('activeUsers', ({ connectedUsers }) => {
        updateActiveUsers(connectedUsers)
      }); 

      // Receive message
      socket.on('message', ({roomName, messageData}) => {
        if (currentRoom === roomName) {
        dispatch(createMessage(messageData));
        }
      })

      // Try reconnecting incase of a disconnect
      socket.on('disconnect', () => {
        setTimeout(() => {
          connectSocket()
        }, 1000);
      })      
  }

  // Auto scroll conversation container
  useEffect(() => {
    const div = divRef.current

    if (div) {
      div.scrollTop = div.scrollHeight
    }
  }, [messages])

  // Get all messages when a contact is clicked
  useEffect(() => {
    
    if (selectedUserId) {
      dispatch(getMessages(selectedUserId))
    }
    
  }, [selectedUserId])

  // Update active/connected users array
  function updateActiveUsers(users) {
    if (users) {
      // Find unique active users 
      const connectedUsers = Array.from(new Set(users.map(obj => obj.id)))
      .map(id => users.find(obj => obj.id === id));

      // Exclude ourselves
      const connectedUsersExclMe = connectedUsers.filter(connectedUser => connectedUser.id !== user.id);

      setActiveUsers(connectedUsersExclMe);

    }
  }

  // Generate room name
  function generateUniqueRoomName(id1, id2) {
    // Sort the IDs alphabetically
    const sortedIds = [id1, id2].sort();
  
    // Concatenate the sorted IDs to create a unique room name
    const roomName = sortedIds.join('-');
  
    return roomName;
  }

  // Joint room with selected user/contact
  function joinRoom(userId) {
    setSelectedUserId(userId);

    const roomName = generateUniqueRoomName(user.id, userId)

    setCurrentRoom(roomName)

    socket.emit('joinRoom', roomName)
  }

  // Handlesubmit
  function handleSubmit(e) {
    e.preventDefault();

    // Focus on the input element when the message's sent
    inputRef.current.focus()

    const roomName = generateUniqueRoomName(selectedUserId, user.id)
    
    // Message data
    const messageData = {
      time: Date.now(),
      sender: user.id,
      recipient: selectedUserId,
      text: newMessage
    }


    // Send text to server
    socket.emit('newMessage', {roomName, messageData})

    // Update messages array
    dispatch(createMessage(messageData))

    // Clear newMessage state
    setNewMessage('')
  }

  // Remove duplicate messages
  const uniqueMessages = uniqBy(messages, 'time')

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        {/* Logo */}
        <div className="text-blue-700 font-extrabold flex items-center text-2xl gap-2 p-4">NexTalk <FaRocketchat size={25}/></div>

        {/* Display active users */}
        {activeUsers.map(user => (
          <div onClick={() => joinRoom(user.id)} 
            key={user.id} 
            className={`border-b border-gray-100 py-2 pl-4 flex items-center gap-2 cursor-pointer ${user.id === selectedUserId ? 'bg-blue-50' : ''}`} >
            <Avatar userId={user.id} username={user.username} online={true}/>
            <span className="text=gray-800">{user.username}</span>
          </div>
        ))}
      </div>

      <div className="bg-blue-100 w-2/3 p-2 flex flex-col" style={{ minWidth: '500px'}}>
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">&larr; Select a contact to start conversng</div>
            </div>
          )}
          {!!selectedUserId && (
            <div  className="relative h-full">
              <div ref={divRef} className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
              {uniqueMessages.map(message => (
                <div key={message.id} className={message.sender === user.id ? 'text-right' : 'text-left'} >
                  <div className={"text-left inline-block p-2 my-2 mx-8 rounded-md text-sm " +(message.sender === user.id ? 'bg-blue-500 text-white':'bg-white text-gray-500')} style={{ minWidth: '50px', maxWidth: '300px', wordWrap: 'break-word' }}>{message.text}</div>
                </div>
              ))}
              </div>
            </div>
            
          )}
        </div>

        {!!selectedUserId && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text"
              value={newMessage}
              ref={inputRef}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-sm p-2"/>
            <button className="bg-blue-500 p-2 text-white rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
        </form>
        )}    
        
      </div>

    </div>
  )
}

export default Profile