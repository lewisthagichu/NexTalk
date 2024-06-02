import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { FaArrowLeftLong } from 'react-icons/fa6';
import UserHeader from './UserHeader';
import Messages from './Messages';
import SendMessagesForm from './SendMessagesForm';

function Conversation() {
  const { selectedUser, activeUsers } = useContext(ChatContext);
  return (
    <div className="flex flex-col flex-grow">
      {!selectedUser && (
        <div className="flex flex-grow items-center justify-center">
          <div className="flex  items-center  gap-2 text-gray-300">
            <FaArrowLeftLong /> Select a contact to start conversng
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="conversation-container">
          <UserHeader activeUsers={activeUsers} selectedUser={selectedUser} />
          <Messages selectedUser={selectedUser} />
          <SendMessagesForm selectedUser={selectedUser} />
        </div>
      )}
    </div>
  );
}

export default Conversation;
