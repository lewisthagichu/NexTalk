import { createContext, useContext, useState } from 'react';

export const ChatContext = createContext();

export function ChatContextProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const value = {
    notifications,
    setNotifications,
    currentRoom,
    setCurrentRoom,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    setOnlineUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
