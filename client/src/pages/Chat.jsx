/* eslint-disable react/no-unknown-property */
import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { NotificationsContext } from '../context/NotificationsContext';
import { getUsers } from '../features/auth/authSlice';
import { updateOnlineUsers } from '../utils/usersServices';
import { getNotifications } from '../utils/notificationServices';
import getSocket from '../utils/socket';
import Sidebar from '../components/Sidebar/Sidebar';
import Contacts from '../components/Contacts/Contacts';
import Conversation from '../components/Conversation/Conversation';

function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { setOnlineUsers } = useContext(ChatContext);
  const { dispatch: notificationDispatch } = useContext(NotificationsContext);

  // Proceed with the rest of the component logic only if the user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/register');
      return;
    }
    // Get all users from database
    dispatch(getUsers());

    const socket = getSocket(user.token);
    setSocket(socket);

    // Receive online users
    socket.on('onlineUsers', ({ connectedUsers }) => {
      const onlineUsers = updateOnlineUsers(connectedUsers, user._id);
      setOnlineUsers(onlineUsers);
    });

    // Try reconnecting incase of a disconnect
    socket.on('disconnect', () => {
      setTimeout(() => {
        const socket = getSocket(user.token);
        setSocket(socket);
      }, 1000);
    });
  }, [user, setOnlineUsers, navigate, dispatch]);

  useEffect(() => {
    // Fetch notifications from backend when the user logs in
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(user.token);
        notificationDispatch({ type: 'SET_NOTIFICATIONS', payload: res });
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, [user, dispatch, notificationDispatch]);

  if (!user) return null;

  return (
    <div className="flex h-screen">
      <section className="bg-white w-1/3 flex left">
        <Sidebar />
        <Contacts />
      </section>

      <section className="bg-blue-100 w-2/3 flex flex-col right">
        <Conversation />
      </section>
    </div>
  );
}

export default Chat;
