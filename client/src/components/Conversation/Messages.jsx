import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../../features/messages/messagesSlice';
import { uniqBy } from 'lodash';
import Message from './Message';
import { markAsRead } from '../../utils/notificationServices';
import { useNotificationsContext } from '../../hooks/useNotificationsContext';

function Messages({ selectedUser }) {
  const { user } = useSelector((state) => state.auth);
  const { messages, isLoading } = useSelector((state) => state.messages);

  const { dispatch: notificationDispatch } = useNotificationsContext();

  const divRef = useRef();
  const dispatch = useDispatch();

  // Get all messages / read notifications when a contact is clicked
  useEffect(() => {
    dispatch(getMessages(selectedUser._id));
    notificationDispatch({
      type: 'MARK_READ',
      payload: { sender: selectedUser._id },
    });

    const markRead = async () => {
      try {
        await markAsRead(selectedUser._id, user.token);
      } catch (error) {
        console.log(error);
      }
    };

    markRead();
  }, [selectedUser, dispatch, notificationDispatch, user]);

  // Auto scroll conversation container
  useEffect(() => {
    const div = divRef.current;
    if (div) div.scrollTop = div.scrollHeight;
  }, [messages]);

  // Remove duplicate messages
  const uniqueMessages = uniqBy(messages, 'time');

  return (
    <div ref={divRef} className="flex-grow overflow-y-scroll relative">
      {!isLoading &&
        uniqueMessages.map((message, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : null;
          return (
            <Message
              key={message._id}
              message={message}
              prevMsg={prevMsg}
              senderName={
                message.sender === user._id
                  ? user.username
                  : selectedUser.username
              }
            />
          );
        })}
    </div>
  );
}

export default Messages;
