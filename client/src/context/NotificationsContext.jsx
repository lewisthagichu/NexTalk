import React, { createContext, useReducer, useContext } from 'react';

const NotificationsContext = createContext();

const notificationsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return action.payload;
    case 'ADD_NOTIFICATION':
      return [action.payload, ...state];
    case 'MARK_READ':
      return state.map((notification) =>
        notification.senderId === action.payload.senderId
          ? { ...notification, isRead: true }
          : notification
      );
    default:
      return state;
  }
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationsReducer, []);

  return (
    <NotificationsContext.Provider value={{ notifications, dispatch }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
