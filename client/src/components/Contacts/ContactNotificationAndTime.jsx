import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useChatContext } from '../../hooks/useChatContext';
import { useNotificationsContext } from '../../hooks/useNotificationsContext';
import { markAsRead } from '../../utils/notificationServices';
import { createDebouncedFunction } from '../../utils/denounce';

function ContactNotificationAndTime({
  contact,
  unreadCount,
  latestMsgTime,
  contactNotifications,
}) {
  const { user } = useSelector((state) => state.auth);
  const { selectedUser } = useChatContext();

  const { dispatch: notificationDispatch } = useNotificationsContext();

  // Function to mark notifications as read
  const markNotificationsAsRead = useCallback(async () => {
    const unreadNotifications = contactNotifications.filter(
      (notification) =>
        !notification.isRead &&
        notification.sender === selectedUser._id &&
        notification.recipient === user._id
    );

    // Update global notifications context
    if (unreadNotifications.length > 0) {
      notificationDispatch({
        type: 'MARK_READ',
        payload: { sender: selectedUser._id },
      });

      // Update the database
      try {
        await markAsRead(selectedUser._id, user.token);
      } catch (error) {
        console.error('Failed to mark notifications as read', error);
      }
    }
  }, [contactNotifications, selectedUser, user, notificationDispatch]);

  // Debounce the markNotificationsAsRead function
  const debouncedMarkAsRead = createDebouncedFunction(
    markNotificationsAsRead,
    300
  );

  useEffect(() => {
    if (
      contactNotifications.length > 0 &&
      selectedUser &&
      selectedUser._id === contact._id
    ) {
      debouncedMarkAsRead();
    }

    // Cleanup function to cancel debounced call on unmount or dependencies change
    return () => {
      debouncedMarkAsRead.cancel();
    };
  }, [selectedUser, contact, debouncedMarkAsRead, contactNotifications]);

  return (
    <div className="contact-right">
      <p className="text-time">{latestMsgTime}</p>
      {selectedUser?._id !== contact._id && (
        <div className={unreadCount > 0 ? 'notification' : 'hide'}>
          <small>{unreadCount || ''}</small>
        </div>
      )}
    </div>
  );
}

export default ContactNotificationAndTime;
