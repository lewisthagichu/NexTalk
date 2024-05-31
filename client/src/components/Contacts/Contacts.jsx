import Contact from './Contact';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import { useContext, useEffect } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { useDispatch, useSelector } from 'react-redux';

function Contacts({ joinRoom, offlineUsers }) {
  const { selectedUser } = useContext(ChatContext);
  const { allUsers } = useSelector((state) => state.auth);

  return (
    <div className="contacts-container">
      <SearchContactsForm />
      <div className="contacts">
        {allUsers.map((user) => (
          <Contact
            key={user._id}
            contact={user}
            joinRoom={joinRoom}
            selected={user._id === selectedUser?._id}
            online={true}
          />
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
