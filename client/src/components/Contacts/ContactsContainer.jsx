import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getNotifications } from '../../utils/notificationServices';
import { updateOnlineUsers } from '../../utils/usersServices';
import Contacts from './Contacts';
import Footer from '../Footer';
import SearchContactsForm from './SearchContactsForm';
import { useChatContext } from '../../hooks/useChatContext';
import { useNotificationsContext } from '../../hooks/useNotificationsContext';

function ContactsContainer() {
  const { user } = useSelector((state) => state.auth);

  const { onlineUsers, setOnlineUsers, selectedUser } = useChatContext();
  const { dispatch: notificationDispatch } = useNotificationsContext();

  const fetchNotifications = useCallback(async () => {
    try {
      console.log('hi');
      const res = await getNotifications(user.token);
      notificationDispatch({ type: 'SET_NOTIFICATIONS', payload: res });
    } catch (error) {
      console.log(error);
    }
  }, [user.token, notificationDispatch]);

  useEffect(() => {
    if (!selectedUser) {
      const intervalId = setInterval(fetchNotifications, 5000);

      return () => clearInterval(intervalId);
    }
  }, [selectedUser, fetchNotifications]);

  return (
    <div className="contacts-container">
      <SearchContactsForm />
      <Contacts />
      <Footer />
    </div>
  );
}

export default ContactsContainer;
