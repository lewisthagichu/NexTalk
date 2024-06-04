import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatContext } from '../../context/ChatContext';
import Contact from './Contact';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import { getUsers } from '../../features/auth/authSlice';

function Contacts() {
  const { allUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { onlineUsers } = useContext(ChatContext);

  useEffect(() => {
    dispatch(getUsers());
  }, [onlineUsers, allUsers, dispatch]);

  return (
    <div className="contacts-container">
      <SearchContactsForm />
      <div className="contacts">
        {allUsers.map((user) => (
          <Contact key={user._id} contact={user} />
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
