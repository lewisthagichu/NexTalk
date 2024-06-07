import React, { createContext, useReducer } from 'react';

export const NotificationsContext = createContext();

const notificationsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return action.payload;
    case 'ADD_NOTIFICATION':
      return [action.payload, ...state];
    case 'MARK_READ':
      return state.map((notification) =>
        notification.sender === action.payload.sender
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
