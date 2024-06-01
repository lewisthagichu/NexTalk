import Contact from './Contact';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import getSocket from '../../utils/socket';
import { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnlineUsers } from '../../utils/usersServices';
import { addMessage } from '../../features/messages/messagesSlice';
import { generateUniqueRoomName } from '../../utils/usersServices';

function Contacts({ offlineUsers }) {
  const {
    selectedUser,
    setSelectedUser,
    setNotifications,
    setOnlineUsers,
    currentRoom,
    setCurrentRoom,
  } = useContext(ChatContext);
  const { user, allUsers } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  const dispatch = useDispatch();
  const currentRoomRef = useRef(currentRoom);

  useEffect(() => {
    const socket = getSocket(user.token);
    setSocket(socket);

    // Receive onlineusers
    socket.on('activeUsers', ({ connectedUsers }) => {
      const onlineUsers = updateOnlineUsers(connectedUsers, user._id);
      setOnlineUsers(onlineUsers);
    });

    // Recipient gets message from socketIO server
    socket.on('message', ({ messageRoom, newText, newFile }) => {
      let currentRoom = currentRoomRef.current;
      if (currentRoom === messageRoom) {
        const message = newFile ? newFile : newText;
        dispatch(addMessage(message));
        console.log('first');
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
  }, []);

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

  return (
    <div className="contacts-container">
      <SearchContactsForm />
      <div className="contacts">
        {allUsers.map((user) => (
          <Contact
            key={user._id}
            contact={user}
            joinRoom={joinRoom}
            selected={user._id === selectedUser?._id}
            online={true}
          />
        ))}
        {/* {offlineUsers.map((user) => (
          <Contact
            key={user._id}
            contact={user}
            joinRoom={joinRoom}
            selected={user._id === selectedUser?._id}
            online={false}
          />
        ))} */}
      </div>
      <Footer />
    </div>
  );
}

export default Contacts;
