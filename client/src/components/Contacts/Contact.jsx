import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChatContext } from '../../hooks/useChatContext';
import { useNotificationsContext } from '../../hooks/useNotificationsContext';
import { formatNotificationDate } from '../../utils/extractTime';
import { uniqBy } from 'lodash';
import Avatar from '../Avatar';
import ContactNotificationAndTime from './ContactNotificationAndTime';

function Contact({ contact, joinRoom }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestMsgContent, setLatestMsgContent] = useState('');
  const [latestMsgTime, setLatestMsgTime] = useState('');
  const [isMine, setIsMine] = useState(false);
  const [contactNotifications, setContactNotifications] = useState([]);

  const { selectedUser } = useChatContext();
  const { notifications } = useNotificationsContext();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (notifications && contact) {
      // Filter notifications relevant to the contact
      const contactNotifications = notifications.filter(
        (notification) =>
          (notification.sender === contact._id ||
            notification.recipient === contact._id) &&
          (notification.sender === user._id ||
            notification.recipient === user._id)
      );

      const uniqueNotifications = uniqBy(contactNotifications, '_id');
      setContactNotifications(uniqueNotifications);

      if (uniqueNotifications.length > 0) {
        // Sort by date to find the latest notification
        const sortedNotifications = uniqueNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const latestNotification = sortedNotifications[0];
        setLatestMsgContent(latestNotification.content);
        setLatestMsgTime(formatNotificationDate(latestNotification.createdAt));
        setIsMine(latestNotification.recipient === user._id);
      } else {
        setLatestMsgContent('');
        setLatestMsgTime('');
        setIsMine(false);
      }

      setUnreadCount(
        uniqueNotifications.filter(
          (notification) =>
            !notification.isRead && notification.sender === contact._id
        ).length
      );
    }
  }, [notifications, contact, user]);

  const handleJoinRoom = () => {
    joinRoom(contact);
  };

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
          <p className={`latest-text ${isMine ? 'mine' : ''}`}>
            {latestMsgContent}
          </p>
        </div>
      </div>
      <ContactNotificationAndTime
        contact={contact}
        unreadCount={unreadCount}
        latestMsgTime={latestMsgTime}
        contactNotifications={contactNotifications}
      />
    </div>
  );
}

export default Contact;
