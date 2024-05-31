/* eslint-disable react/no-unknown-property */
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import {
  IoCall,
  IoSearch,
  IoSendSharp,
  IoAttachOutline,
} from 'react-icons/io5';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { uniqBy } from 'lodash';
import io from 'socket.io-client';
import { getUsers } from '../features/auth/authSlice';
import {
  createMessage,
  uploadFile,
  getMessages,
  addMessage,
} from '../features/messages/messagesSlice';
import Avatar from '../components/Avatar';
import Sidebar from '../components/Sidebar/Sidebar';
import generateUniqueRoomName from '../utils/generateUniqueRoomName';
import Contacts from '../components/Contacts/Contacts';
import Conversation from '../components/Conversation/Conversation';

function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, allUsers } = useSelector((state) => state.auth);
  const { messages, isError, serverMessage } = useSelector(
    (state) => state.messages
  );

  const {
    setNotifications,
    selectedUser,
    setSelectedUser,
    currentRoom,
    setCurrentRoom,
  } = useContext(ChatContext);

  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);

  const [isOnline, setIsOnline] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const currentRoomRef = useRef(currentRoom);

  const isSubmitDisabled = !newMessage;

  // Proceed with the rest of the component logic only if the user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, []);

  // Connect to server
  function connectSocket() {
    const { token } = user;

    // Connect socket with authentication token
    const socket = io.connect('http://localhost:5000', {
      auth: {
        token,
      },
    });

    setSocket(socket);

    // Receive active/connected users
    socket.on('activeUsers', ({ connectedUsers }) => {
      updateActiveUsers(connectedUsers);
    });

    // Recipient gets message from socketIO server
    socket.on('message', ({ messageRoom, messageData, fileData }) => {
      let currentRoom = currentRoomRef.current;
      if (currentRoom === messageRoom) {
        const data = fileData ? fileData : messageData;
        dispatch(addMessage(data));
      }
    });

    // Recipient gets message from socketIO server
    socket.on('notification', ({ messageRoom, data }) => {
      let currentRoom = currentRoomRef.current;
      if (currentRoom === messageRoom) {
        const newData = { ...data, isRead: true };
        setNotifications((prev) => [newData, ...prev]);
      } else {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    // Try reconnecting incase of a disconnect
    socket.on('disconnect', () => {
      setTimeout(() => {
        connectSocket();
      }, 1000);
    });
  }

  // Get offline users and check if they are online
  useEffect(() => {
    if (activeUsers) {
      dispatch(getUsers());

      // const inactiveUsers = allUsers.filter(contact => {
      //   return !activeUsers.some(activeUser => activeUser._id === contact.id);
      // });

      // setOfflineUsers(inactiveUsers);
    }
  }, [activeUsers, dispatch]);

  // Get all messages when a contact is clicked
  useEffect(() => {
    if (selectedUser) {
      const isOnline = activeUsers.some(
        (item) =>
          item.id === selectedUser._id &&
          item.username === selectedUser.username
      );

      setIsOnline(isOnline);

      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser, activeUsers, dispatch]);

  // Update active/connected users array
  function updateActiveUsers(users) {
    if (users) {
      // Find unique active users
      const connectedUsers = Array.from(
        new Set(users.map((obj) => obj.id))
      ).map((id) => users.find((obj) => obj.id === id));

      // Exclude ourselves
      const connectedUsersExclMe = connectedUsers.filter(
        (connectedUser) => connectedUser._id !== user._id
      );

      setActiveUsers(connectedUsersExclMe);
    }
  }

  // Joint room with selected user/contact
  function joinRoom(selectedUser) {
    const roomName = generateUniqueRoomName(user._id, selectedUser._id);
    setCurrentRoom(roomName);
    currentRoomRef.current = roomName;

    // Set selected user state
    setSelectedUser(selectedUser);

    // Send joinRoom event to socketIO server
    socket.emit('joinRoom', roomName);
  }

  if (!user) return null;

  return (
    user && (
      <div className="flex h-screen">
        <section className="bg-white w-1/3 flex left">
          <Sidebar />
          <Contacts
            allUsers={allUsers}
            offlineUsers={offlineUsers}
            joinRoom={joinRoom}
          />
        </section>

        <section className="bg-blue-100 w-2/3 flex flex-col right">
          <Conversation isOnline={isOnline ? 'Online' : 'Offline'} />
        </section>
      </div>
    )
  );
}

export default Chat;
