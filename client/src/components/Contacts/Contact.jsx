import { useSelector } from 'react-redux';
import { useChatContext } from '../../hooks/useChatContext';
import { useNotificationsContext } from '../../hooks/useNotificationsContext';
import Avatar from '../Avatar';
import { useEffect, useState } from 'react';
import { uniqBy } from 'lodash';

function Contact({ contact, joinRoom }) {
  const [latestMsg, setLatestMsg] = useState(null);
  const [msgTime, setMsgTime] = useState(null);
  const [unreadCount, setUnreadCount] = useState(null);

  const { selectedUser } = useChatContext();
  const { notifications } = useNotificationsContext();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (notifications && contact) {
      const contactNotifications = notifications.filter(
        (notification) =>
          notification.sender === contact._id && !notification.isRead
      );

      const uniqueNotifications = uniqBy(contactNotifications, '_id');

      if (uniqueNotifications.length > 0) {
        const sortedNotifications = uniqueNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestMsg(sortedNotifications[0].content);
      } else {
        setLatestMsg('');
      }

      setUnreadCount(uniqueNotifications.length);
    }
  }, [notifications, contact]);

  const handleJoinRoom = () => {
    joinRoom(contact);
  };

  // console.log(unreadCount);

  return (
    <div
      onClick={handleJoinRoom}
      className={`contact ${
        contact._id === selectedUser?._id ? 'selected' : ''
      }`}
    >
      <div className="contact-left">
        <Avatar contact={contact} profileExists={false} />

        <div className="contact-context">
          <p className="text-gray font-semibold text-lg">{contact.username}</p>
          <p className="latest-text">{latestMsg}</p>
        </div>
      </div>
      <div className="contact-right">
        <p className="text-time">3/6/2024</p>
        <div className={unreadCount > 0 ? 'notification' : 'hide'}>
          <small>{unreadCount > 0 ? unreadCount : ''}</small>
        </div>
      </div>
    </div>
  );
}

export default Contact;
