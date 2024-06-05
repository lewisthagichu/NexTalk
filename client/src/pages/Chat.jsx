/* eslint-disable react/no-unknown-property */
import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { getUsers } from '../features/auth/authSlice';
import { updateOnlineUsers } from '../utils/usersServices';
import getSocket from '../utils/socket';
import Sidebar from '../components/Sidebar/Sidebar';
import Contacts from '../components/Contacts/Contacts';
import Conversation from '../components/Conversation/Conversation';
import Spinner from '../components/Spinner';

function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.messages);
  const { setOnlineUsers } = useContext(ChatContext);

  // Proceed with the rest of the component logic only if the user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/register');
      return;
    }
    // Get all users from database
    dispatch(getUsers());

    const socket = getSocket(user.token);

    // Receive online users
    socket.on('onlineUsers', ({ connectedUsers }) => {
      const onlineUsers = updateOnlineUsers(connectedUsers, user._id);
      setOnlineUsers(onlineUsers);
    });
  }, [user, setOnlineUsers, navigate, dispatch]);

  if (!user) return null;

  return isLoading ? (
    <Spinner loading={isLoading} />
  ) : (
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
