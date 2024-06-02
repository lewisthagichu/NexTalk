/* eslint-disable react/no-unknown-property */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../features/auth/authSlice';
import Sidebar from '../components/Sidebar/Sidebar';
import Contacts from '../components/Contacts/Contacts';
import Conversation from '../components/Conversation/Conversation';
import getSocket from '../utils/socket';

function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const { onlineUsers, setOnlineUsers } = useContext(ChatContext);

  // const [activeUsers, setActiveUsers] = useState([]);
  // const [offlineUsers, setOfflineUsers] = useState([]);

  // Proceed with the rest of the component logic only if the user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/register');
      return;
    }
    // Get all users from database
    dispatch(getUsers());

    // Connect socket with authentication token
    const { token } = user;
    const socket = getSocket(token);

    // Try reconnecting incase of a disconnect
    socket.on('disconnect', () => {
      setTimeout(() => {
        getSocket(token);
      }, 1000);
    });

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, [user, navigate, dispatch]);

  // Get offline users and check if they are online
  // useEffect(() => {
  //   if (activeUsers) {
  //     dispatch(getUsers());

  //     // const inactiveUsers = allUsers.filter(contact => {
  //     //   return !activeUsers.some(activeUser => activeUser._id === contact.id);
  //     // });

  //     // setOfflineUsers(inactiveUsers);
  //   }
  // }, [activeUsers, dispatch]);

  if (!user) return null;

  return (
    <div className="flex h-screen">
      <section className="bg-white w-1/3 flex left">
        <Sidebar />
        <Contacts user={user} />
      </section>

      <section className="bg-blue-100 w-2/3 flex flex-col right">
        <Conversation />
      </section>
    </div>
  );
}

export default Chat;
