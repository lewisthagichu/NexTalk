import { useSelector } from 'react-redux';
import Contact from './Contact';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';

function Contacts() {
  const { allUsers } = useSelector((state) => state.auth);

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
