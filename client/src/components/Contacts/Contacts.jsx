import { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChatContext } from '../../context/ChatContext';
import { NotificationsContext } from '../../context/NotificationsContext';
import { addMessage } from '../../features/messages/messagesSlice';
import { generateUniqueRoomName } from '../../utils/usersServices';
import Contact from './Contact';
import getSocket from '../../utils/socket';

function Contacts() {
  const [socket, setSocket] = useState();
  const [currentRoom, setCurrentRoom] = useState(null);
  const currentRoomRef = useRef(currentRoom);

  const { setSelectedUser } = useContext(ChatContext);
  const { dispatch: notificationDispatch } = useContext(NotificationsContext);

  const { user, allUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
    <div className="contacts">
      {allUsers.map((user) => (
        <Contact key={user._id} contact={user} joinRoom={joinRoom} />
      ))}
    </div>
  );
}

export default Contacts;
