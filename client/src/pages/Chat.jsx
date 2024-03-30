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
import { getUsers } from "../features/auth/authSlice"
import { createMessage, getMessages, reset } from "../features/messages/messagesSlice"
import Avatar from "../components/Avatar";
import Contacts from "../components/Contacts"
import Message from "../components/Message";
import Footer from '../components/Footer'

function Chat() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [socket,setSocket] = useState(null)
  const [activeUsers, setActiveUsers] = useState([])
  const [offlineUsers, setOfflineUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isOnline, setIsOnline] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [currentRoom, setCurrentRoom] = useState(null)
  const [currentProfile, setCurrentProfile] = useState("")
  const inputRef = useRef()
  const divRef = useRef()
  const {user, allUsers} = useSelector(state => state.auth)
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

  // Get offline users and check if they are online
  useEffect(() => {
    if (user) {
      dispatch(getUsers())

      const inactiveUsers = allUsers.filter(contact => {
        return contact.id !== user.id && !activeUsers.some(activeUser => activeUser.id === contact.id);
      });

      setOfflineUsers(inactiveUsers);

      if (selectedUser) {
        const isOnline = activeUsers.some(item => item.id === selectedUser.id && item.username === selectedUser.username);

        setIsOnline(isOnline);
      }
    }
    
  }, [activeUsers, allUsers, selectedUser])

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
  function joinRoom(selectedUser) {
    // Set selected user state and its corresponding ID
    setSelectedUser(selectedUser);
    setSelectedUserId(selectedUser.id);

    const roomName = generateUniqueRoomName(user.id, selectedUser.id)
    setCurrentRoom(roomName)

    socket.emit('joinRoom', roomName)
    console.log(offlineUsers);
  }

  // Handle message submit
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
          <div className="icons">
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
            {activeUsers.map(user => (
              <Contacts 
                key={user.id}
                selectedUser={user}
                joinRoom={joinRoom}
                selected={user.id === selectedUserId}  
                online={true}
              />
            ))}
            {offlineUsers.map(user => (
              <Contacts 
                key={user.id}
                selectedUser={user}
                joinRoom={joinRoom}
                selected={user.id === selectedUserId} 
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
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="flex  items-center  gap-2 text-gray-300"><FaArrowLeftLong/> Select a contact to start conversng</div>
            </div>
          )}
          {!!selectedUserId && ( 
            <>  
            <div className="details">
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
            <div  className="relative h-full">  
              <div ref={divRef} className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
              {uniqueMessages.map(message => (
                <Message 
                  key={message.id}
                  message={message}
                  senderName={message.sender === user.id ? user.username : selectedUser.username}
                  />
              ))}
              </div>
            </div>
            </>
            
          )}
        </div>

        {/* SEND FORM */}
        {!!selectedUserId && (
          <form onSubmit={handleSubmit} className="send-form" >
            <label htmlFor="file"><IoAttachOutline size={24}/></label>
            <input 
              type="file" 
              name="file" 
              id="file" 
              accept='.jpeg, .png, .jpg'/>
            <input 
              type="text"
              value={newMessage}
              ref={inputRef}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here"
              />
            <button>
              <IoSendSharp color="#4299e1" size={25} />
            </button>
        </form>
        )}    
        
      </section>
    </div>
  </>
  )
}

export default Chat