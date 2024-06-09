import { useSelector } from 'react-redux';
import { useChatContext } from '../../hooks/useChatContext';
import Avatar from '../Avatar';
import { useEffect, useState } from 'react';
import { uniqBy } from 'lodash';
import { useNotificationsContext } from '../../hooks/useNotificationsContext';
import { formatNotificationDate } from '../../utils/extractTime';

function Contact({ contact, joinRoom }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestMsgContent, setLatestMsgContent] = useState('');
  const [latestMsgTime, setLatestMsgTime] = useState('');
  const [isMine, setIsMine] = useState(false);

  const { selectedUser } = useChatContext();
  const { notifications } = useNotificationsContext();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (notifications && contact) {
      // Filter notifications relevant to the contact
      const contactNotifications = notifications.filter(
        (notification) =>
          (notification.sender === contact._id ||
            notification.receiver === contact._id) &&
          (notification.sender === user._id ||
            notification.receiver === user._id)
      );

      const uniqueNotifications = uniqBy(contactNotifications, '_id');

      if (uniqueNotifications.length > 0) {
        // Sort by date to find the latest notification
        const sortedNotifications = uniqueNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const latestNotification = sortedNotifications[0];
        setLatestMsgContent(latestNotification.content);
        setLatestMsgTime(formatNotificationDate(latestNotification.createdAt));
        setIsMine(latestNotification.receiver === user._id); // Check if the latest message was sent by the user
      } else {
        setLatestMsgContent('');
        setLatestMsgTime('');
        setIsMine(false);
      }

      setUnreadCount(
        contactNotifications.filter(
          (notification) =>
            !notification.isRead && notification.sender === contact._id
        ).length
      );
    }
  }, [notifications, contact, user]);

  console.log(notifications);

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
      <div className="contact-right">
        <p className="text-time">{latestMsgTime}</p>
        <div>
          <small>{unreadCount > 0 ? unreadCount : 0}</small>
        </div>
      </div>
    </div>
  );
}

export default Contact;
