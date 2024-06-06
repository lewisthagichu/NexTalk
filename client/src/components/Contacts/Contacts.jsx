import { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatContext } from '../../context/ChatContext';
import { addMessage } from '../../features/messages/messagesSlice';
import { generateUniqueRoomName } from '../../utils/usersServices';
import { updateOnlineUsers } from '../../utils/usersServices';
import Contact from './Contact';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import getSocket from '../../utils/socket';

function Contacts() {
  const [socket, setSocket] = useState();
  const [currentRoom, setCurrentRoom] = useState(null);
  const currentRoomRef = useRef(currentRoom);

  const { allUsers, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { onlineUsers, setOnlineUsers, setNotifications, setSelectedUser } =
    useContext(ChatContext);

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
        }
      });

      // Recipient gets notification from socketIO server
      socket.on('notification', ({ messageRoom, notification }) => {
        let currentRoom = currentRoomRef.current;
        // if (currentRoom === messageRoom) {
        //   const newData = { ...data, isRead: true };
        //   setNotifications((prev) => [newData, ...prev]);
        // } else {
        //   setNotifications((prev) => [data, ...prev]);
        // }
      });
    }
  }, [user, setNotifications, setOnlineUsers, dispatch]);

  // Joint room with selected user/contact
  function joinRoom(selectedContact) {
    const roomName = generateUniqueRoomName(user._id, selectedContact._id);

    setCurrentRoom(roomName);
    currentRoomRef.current = roomName;

    // console.log(`The selected room is: ${roomName}`);

    setSelectedUser(selectedContact);

    socket.emit('joinRoom', roomName);
  }

  return (
    <div className="contacts-container">
      <SearchContactsForm />
      <div className="contacts">
        {allUsers.map((user) => (
          <Contact key={user._id} contact={user} joinRoom={joinRoom} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Contacts;
