import { useContext } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';

export const useNotificationsContext = () => useContext(NotificationsContext);
