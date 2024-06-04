import { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatContext } from '../../context/ChatContext';
import { addMessage } from '../../features/messages/messagesSlice';
import { generateUniqueRoomName } from '../../utils/usersServices';
import { getUsers } from '../../features/auth/authSlice';
import Contact from './Contact';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import getSocket from '../../utils/socket';

function Contacts() {
  const [socket, setSocket] = useState();
  const [currentRoom, setCurrentRoom] = useState(null);

  const currentRoomRef = useRef(currentRoom);
  const { onlineUsers, setNotifications, setSelectedUser } =
    useContext(ChatContext);

  const { allUsers, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getUsers());
  // }, [onlineUsers, dispatch]);

  useEffect(() => {
    if (user) {
      const socket = getSocket(user.token);
      setSocket(socket);

      // Recipient gets message from socketIO server
      socket.on('message', ({ messageRoom, newText, newFile }) => {
        let currentRoom = currentRoomRef.current;
        // console.log(`The room the message was received is: ${currentRoom}`);
        // console.log(`The messageroom received is ${messageRoom}`);

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
    }
    // Cleanup function
    // return () => {
    //   if (socket) {
    //     socket.disconnect();
    //   }
    // };
  }, [user, setNotifications, dispatch]);

  // Joint room with selected user/contact
  function joinRoom(selectedContact) {
    const roomName = generateUniqueRoomName(user._id, selectedContact._id);
    setCurrentRoom(roomName);
    currentRoomRef.current = roomName;

    // console.log(`The selected room is: ${roomName}`);

    // Set selected user state
    setSelectedUser(selectedContact);

    // Send joinRoom event to socketIO server
    socket.emit('joinRoom', roomName);
  }

  return (
    <div className="contacts-container">
      <SearchContactsForm />
      <div className="contacts">
        {allUsers.map((user) => (
          <Contact key={user._id} contact={user} joinRoom={joinRoom} />
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
