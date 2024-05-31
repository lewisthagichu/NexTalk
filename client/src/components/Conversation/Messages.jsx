import { useRef, useEffect } from 'react';
import { uniqBy } from 'lodash';
import { useSelector } from 'react-redux';
import Message from './Message';

function Messages({ selectedUser }) {
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.messages);
  const divRef = useRef();

  // Auto scroll conversation container
  useEffect(() => {
    const div = divRef.current;
    if (div) div.scrollTop = div.scrollHeight;
  }, [messages]);

  // Remove duplicate messages
  const uniqueMessages = uniqBy(messages, 'time');
  return (
    <div ref={divRef} className="flex-grow overflow-y-scroll relative">
      {uniqueMessages.map((message, index) => {
        const prevMsg = index > 0 ? messages[index - 1] : null;
        return (
          <Message
            key={message.id}
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
