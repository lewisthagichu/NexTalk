import { createContext, useState } from 'react';

export const ChatContext = createContext();

export function ChatContextProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const [currentRoom, setCurrentRoom] = useState(null);

  const value = {
    notifications,
    setNotifications,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    setOnlineUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
