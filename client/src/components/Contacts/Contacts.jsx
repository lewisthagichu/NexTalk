import Contact from './Contact';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import getSocket from '../../utils/socket';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { useSelector } from 'react-redux';
import { updateOnlineUsers } from '../../utils/usersServices';

function Contacts({ user }) {
  const { setOnlineUsers } = useContext(ChatContext);
  const { allUsers } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const socket = getSocket(user.token);
      setSocket(socket);

      // Receive online users
      socket.on('onlineUsers', ({ connectedUsers }) => {
        const onlineUsers = updateOnlineUsers(connectedUsers, user._id);
        setOnlineUsers(onlineUsers);
      });
    }

    // Cleanup function
    // return () => {
    //   if (socket) {
    //     socket.disconnect();
    //   }
    // };
  }, [user]);

  return (
    <div className="contacts-container">
      <SearchContactsForm />
      <div className="contacts">
        {allUsers.map((user) => (
          <Contact key={user._id} contact={user} online={true} />
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
