import { useEffect, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications } from '../../utils/notificationServices';
import { updateOnlineUsers } from '../../utils/usersServices';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import { useChatContext } from '../../hooks/useChatContext';
import { useNotificationsContext } from '../../hooks/useNotificationsContext';
import getSocket from '../../utils/socket';
import { addMessage } from '../../features/messages/messagesSlice';
import { generateUniqueRoomName } from '../../utils/usersServices';
import Contact from './Contact';

function ContactsContainer() {
  const [socket, setSocket] = useState();
  const [currentRoom, setCurrentRoom] = useState(null);
  const currentRoomRef = useRef(currentRoom);

  const { user, allUsers } = useSelector((state) => state.auth);
  const { setSelectedUser } = useChatContext();
  const dispatch = useDispatch();

  const { onlineUsers, setOnlineUsers, selectedUser } = useChatContext();
  const { dispatch: notificationDispatch } = useNotificationsContext();

  // const fetchNotifications = useCallback(async () => {
  //   try {
  //     console.log('hi');
  //     const res = await getNotifications(user.token);
  //     notificationDispatch({ type: 'SET_NOTIFICATIONS', payload: res });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [user.token, notificationDispatch]);

  // useEffect(() => {
  //   if (!selectedUser) {
  //     const intervalId = setInterval(fetchNotifications, 5000);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [selectedUser, fetchNotifications]);

  useEffect(() => {
    const socket = getSocket(user.token);
    setSocket(socket);

    // Recipient gets message from socketIO server
    socket.on('message', ({ messageRoom, notification, newText, newFile }) => {
      let currentRoom = currentRoomRef.current;
      // console.log(`The room the message was received is: ${currentRoom}`);
      // console.log(`The messageroom received is ${messageRoom}`);

      if (currentRoom === messageRoom) {
        const message = newFile ? newFile : newText;
        dispatch(addMessage(message));
      } else {
        console.log(notification);
        notificationDispatch({
          type: 'ADD_NOTIFICATION',
          payload: notification,
        });
      }
    });
  }, [user, dispatch, notificationDispatch]);

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

export default ContactsContainer;
