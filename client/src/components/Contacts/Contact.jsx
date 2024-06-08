import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ChatContext } from '../../context/ChatContext';
import { NotificationsContext } from '../../context/NotificationsContext';

import Avatar from '../Avatar';

function Contact({ contact, joinRoom }) {
  const { selectedUser } = useContext(ChatContext);
  const { notifications } = useContext(ChatContext);
  const { user } = useSelector((state) => state.auth);

  const getUnreadCount = (userId) => {
    return notifications.filter(
      (notification) => notification.senderId === userId && !notification.isRead
    ).length;
  };

  const handleJoinRoom = (selectedContact) => {
    joinRoom(selectedContact);
  };

  return (
    <div
      onClick={() => handleJoinRoom(contact)}
      className={`contact ${
        contact._id === selectedUser?._id ? 'selected' : ''
      }`}
    >
      <div className="contact-left">
        <Avatar contact={contact} profileExists={false} />

        <div className="contact-context">
          <p className="text-gray font-semibold text-lg">{contact.username}</p>
          <p className="latest-text"></p>
        </div>
      </div>
      <div className="contact-right">
        <p className="text-time">3/6/2024</p>
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
}

export default Contact;
