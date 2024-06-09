/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../hooks/useChatContext';
import { useNotificationsContext } from '../hooks/useNotificationsContext';
import { getNotifications } from '../utils/notificationServices';
import { getUsers } from '../features/auth/authSlice';
import { updateOnlineUsers } from '../utils/usersServices';
import { toast } from 'react-toastify';
import getSocket from '../utils/socket';
import Sidebar from '../components/Sidebar/Sidebar';
import ContactsContainer from '../components/Contacts/ContactsContainer';
import Conversation from '../components/Conversation/Conversation';
import Spinner from '../components/Spinner';

function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { setOnlineUsers } = useChatContext();
  const { notifications, dispatch: notificationDispatch } =
    useNotificationsContext();

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

    // Receive notifications
    socket.on('notification', (notification) => {
      if (!notifications.includes(notification)) {
        notificationDispatch({
          type: 'ADD_NOTIFICATION',
          payload: notification,
        });
      }
      console.log('Got notification');
    });

    // Try reconnecting incase of a disconnect
    socket.on('disconnect', () => {
      setTimeout(() => {
        const socket = getSocket(user.token);
        setSocket(socket);
      }, 1000);
    });
  }, [
    user,
    setOnlineUsers,
    navigate,
    dispatch,
    notifications,
    notificationDispatch,
  ]);

  useEffect(() => {
    if (user) {
      // Fetch notifications from backend when the user logs in
      const fetchNotifications = async () => {
        try {
          const res = await getNotifications(user.token);
          notificationDispatch({ type: 'SET_NOTIFICATIONS', payload: res });
          setLoading(false);
        } catch (error) {
          console.log(error);
          toast.error('Something went wrong');
        }
      };

      fetchNotifications();
    }
  }, [user, notificationDispatch]);

  if (!user) return null;

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <div className="flex h-screen">
      <section className="bg-white w-1/3 flex left">
        <Sidebar />
        <ContactsContainer />
      </section>

      <section className="bg-blue-100 w-2/3 flex flex-col right">
        <Conversation />
      </section>
    </div>
  );
}

export default Chat;
