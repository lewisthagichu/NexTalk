/* eslint-disable react/no-unknown-property */
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { IoChatboxEllipses, IoCall, IoSearch, IoSendSharp, IoAttachOutline  } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdGroupAdd } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import {uniqBy} from 'lodash'
import io from 'socket.io-client'
import { reset, getUsers, logout } from "../features/auth/authSlice"
import { createMessage, uploadFile, getMessages, addMessage } from "../features/messages/messagesSlice"
import Avatar from "../components/Avatar";
import Contacts from "../components/Contacts"
import Message from "../components/Message";
import Footer from '../components/Footer'
import generateUniqueRoomName from '../utils/generateUniqueRoomName'

function Chat() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [socket,setSocket] = useState(null)
  const [activeUsers, setActiveUsers] = useState([])
  const [offlineUsers, setOfflineUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isOnline, setIsOnline] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [currentProfile, setCurrentProfile] = useState("")
  const [currentRoom, setCurrentRoom] = useState(null)
  const currentRoomRef = useRef(currentRoom)
  const divRef = useRef()
  const {user, allUsers} = useSelector(state => state.auth)
  const {messages, isError, serverMessage} = useSelector(state => state.messages)
  const isSubmitDisabled = !newMessage;

  // Proceed with the rest of the component logic only if the user is authenticated
  useEffect(() => {
    if (!user) {
        navigate('/register');
    } else {
      dispatch(getUsers())
    }
          
  }, [user, dispatch, navigate])    

  useEffect(() => {  
    if (allUsers.length > 0) {
        connectSocket()
    }          
  }, [allUsers])  

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

      // Recipient gets message from socketIO server
      socket.on('message', ({ messageRoom, messageData, fileData }) => {
        let currentRoom = currentRoomRef.current
        if (currentRoom === messageRoom) {
          const data = fileData ? fileData : messageData
          dispatch(addMessage(data))
        }
      });

      // Try reconnecting incase of a disconnect
      socket.on('disconnect', () => {
        setTimeout(() => {
          connectSocket()
        }, 1000);
      })      
  }

  // Get offline users and check if they are online
  useEffect(() => {
    if (allUsers) {
      // dispatch(getUsers())
      console.log(allUsers);

      // const inactiveUsers = allUsers.filter(contact => {
      //   return contact.id !== user.id && !activeUsers.some(activeUser => activeUser.id === contact.id);
      // });

      // setOfflineUsers(inactiveUsers);
    }
    
  }, [allUsers])

  // Auto scroll conversation container
  useEffect(() => {
    const div = divRef.current
    if (div) div.scrollTop = div.scrollHeight
  }, [messages])

  // Get all messages when a contact is clicked
  useEffect(() => {
    if (selectedUser) {
      const isOnline = activeUsers.some(item => item.id === selectedUser.id && item.username === selectedUser.username);

      setIsOnline(isOnline);

      dispatch(getMessages(selectedUser.id))
    }    
  }, [selectedUser, activeUsers, dispatch])

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

  // Joint room with selected user/contact
  function joinRoom(selectedUser) {
    // Clear newMessage state
    setNewMessage('')

    const roomName = generateUniqueRoomName(user.id, selectedUser.id)
    setCurrentRoom(roomName)
    currentRoomRef.current = roomName

    // Set selected user state
    setSelectedUser(selectedUser);

    // Send joinRoom event to socketIO server
    socket.emit('joinRoom', roomName)    
  }

  // Handle message submit
  function handleSubmit(e, formData = null) {
    e?.preventDefault();

    // Data accompaning each text
    const messageRoom = generateUniqueRoomName(user.id, selectedUser.id)
    const data = {
      time: Date.now(),
      sender: user.id,
      recipient: selectedUser.id,
    }
    const {time, sender, recipient} = data

    if (!formData) {   
      // Message data
      const messageData = {
        id: Date.now(),
        time,
        sender,
        recipient,
        text: newMessage,
        file: null,
      }

      // Send text to server
      socket.emit('newMessage', {messageRoom, messageData})
      dispatch(createMessage(messageData))

      // Clear newMessage state
      setNewMessage('')
    } else {
        formData.append('time', time)
        formData.append('sender', sender)
        formData.append('recipient', recipient)
        formData.append('text', null)
        formData.append('messagroom', messageRoom)

        // Send file to server
        const messageData = {text: null}
        socket.emit('newMessage', {messageRoom, messageData})
        dispatch(uploadFile(formData));
    }    
}

  // Send file
  async function sendFile(e) {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    handleSubmit(null, formData)
  }

  function handleLogout() {
    dispatch(logout())
    dispatch(reset());
    navigate('/')
  }

  // Remove duplicate messages
  const uniqueMessages = uniqBy(messages, 'time')

  if (!user) {
    // If no user, navigate to the register page and return null to prevent rendering anything
    return null;
  }

  return (
    <>
    <div className="flex h-screen">
      <section className="bg-white w-1/3 flex left">
        {/* Sidebar */}
        <aside>
          <div className="container">
            <div className="profile">
              <Avatar 
                profileExists={true}
                />
            </div> 
            <nav> 
              <div className="icons selected">
                <IoChatboxEllipses color="777A7E" size={28}/>
              </div>
              <div className="icons">
                <MdGroupAdd color="777A7E" size={28}/>
              </div>
            </nav>   
          </div>
          <div onClick={handleLogout} className="icons">
            <BiLogOut color="777A7E" size={28}/>
          </div>
               
        </aside>
        
        <div className="contacts-container">
          <div className="top">
            <div className="icons">
                  <IoSearch color="#7d8da1" size={22}/>
            </div>
            <form className="search-bar chats active" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Search contacts"
                />
            </form>
          </div>
          {/* Display active and offline users */}
          <div className="contacts">
            {allUsers.map(user => (
              <Contacts 
                key={user.id}
                selectedUser={user}
                joinRoom={joinRoom}
                selected={user.id === selectedUser?.id}  
                online={true}
              />
            ))}
            {offlineUsers.map(user => (
              <Contacts 
                key={user.id}
                selectedUser={user}
                joinRoom={joinRoom}
                selected={user.id === selectedUser?.id} 
                online={false}
              />
            ))}
          </div>
          <Footer />
        </div>        
      </section>

      {/* Right */}
      <section className="bg-blue-100 w-2/3 flex flex-col right">
        <div className="flex flex-col flex-grow">
          {!selectedUser && (
          <div className="flex flex-grow items-center justify-center">
            <div className="flex  items-center  gap-2 text-gray-300"><FaArrowLeftLong/> Select a contact to start conversng</div>
          </div>
          )}

          {!!selectedUser && ( 
          <div className="conversation-container">  
            {/* USER DETAILS */}
            <div className="user-details">
              <div className="profile">
                <Avatar 
                  profileExists={true}
                />                
                <div className="name">
                  <small className="username">{selectedUser.username}</small>
                  <small>{isOnline ? "Online" : "Offline"}</small>
                </div>
              </div>

              <form className="search-bar chat active" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Search..."
                />
              </form>
            
              <div className="calls">
                <div className="icons">
                  <IoSearch color="#7d8da1" size={22}/>
                </div>
                <div className="icons">
                  <IoCall color="#7d8da1" size={20}/>
                </div>
              </div>
            </div>  

            {/* Messages */} 
            <div ref={divRef} className="flex-grow overflow-y-scroll relative">
            {uniqueMessages.map((message, index) => {
              const prevMsg = index > 0 ? messages[index - 1] : null;
              return (
                <Message 
                  key={message.id}
                  message={message}
                  prevMsg={prevMsg}
                  senderName={message.sender === user.id ? user.username : selectedUser.username}
                />
              )                
              })}
            </div>

            {/* SEND FORM */}
            <form onSubmit={handleSubmit} className="send-form" >
              <label htmlFor="file"><IoAttachOutline size={24}/></label>
              <input 
                type="file" 
                name="file" 
                id="file" 
                accept='.jpeg, .png, .jpg'
                onChange={sendFile}/>
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here"
                />
              <button disabled={isSubmitDisabled}>
                <IoSendSharp color="#4299e1" size={25} />
              </button>
            </form>
          </div>
            
          )}
        </div>        
      </section>
    </div>
  </>
  )
}

export default Chat