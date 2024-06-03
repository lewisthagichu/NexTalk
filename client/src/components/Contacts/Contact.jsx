import { useContext, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateUniqueRoomName } from '../../utils/usersServices';
import { addMessage } from '../../features/messages/messagesSlice';
import { ChatContext } from '../../context/ChatContext';
import useFetchLatestMessage from '../../hooks/useFetchLatestMessage';
import { getUnreadNotifications } from '../../utils/notificationServices';
import getSocket from '../../utils/socket';
import Avatar from '../Avatar';

const Contact = ({ contact, online }) => {
  const { notifications, setNotifications, selectedUser, setSelectedUser } =
    useContext(ChatContext);
  const { user } = useSelector((state) => state.auth);
  // const unreadNotifications = getUnreadNotifications(notifications);
  // const contactNotifications = unreadNotifications?.filter(
  //   (n) => n.sender === contact._id
  // );
  // const {latestMessage} = useFetchLatestMessage(contact.id)
  // console.log(`Nots: ${JSON.stringify(contactNotifications)}`);

  const [socket, setSocket] = useState();
  const [currentRoom, setCurrentRoom] = useState(null);

  const currentRoomRef = useRef(currentRoom);
  const dispatch = useDispatch();
  // console.log(contact);

  useEffect(() => {
    if (user) {
      const socket = getSocket(user.token);
      setSocket(socket);

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
    }
    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, dispatch]);

  // Joint room with selected user/contact
  function joinRoom() {
    const roomName = generateUniqueRoomName(user._id, contact._id);
    setCurrentRoom(roomName);
    currentRoomRef.current = roomName;

    // Set selected user state
    setSelectedUser(contact);

    // Send joinRoom event to socketIO server
    socket.emit('joinRoom', roomName);
  }
  return (
    <div
      onClick={joinRoom}
      className={`contact ${
        contact._id === selectedUser?._id ? 'selected' : ''
      }`}
    >
      <div className="contact-left">
        <Avatar
          userId={contact._id}
          username={contact.username}
          online={online}
          profileExists={false}
        />

        <div className="contact-context">
          <p className="text-gray font-semibold text-lg">{contact.username}</p>
          <p className="latest-text"></p>
        </div>
      </div>
      <div className="contact-right">
        <p className="text-time">30/5/2024</p>
        <div
        // className={contactNotifications?.length > 0 ? 'notification' : 'hide'}
        >
          <small>
            {/* {contactNotifications?.length > 0 ? contactNotifications.length : 0} */}
          </small>
        </div>
      </div>
    </div>
  );
};

export default Contact;
