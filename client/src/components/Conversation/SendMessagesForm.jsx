import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoAttachOutline, IoSendSharp } from 'react-icons/io5';
import generateUniqueRoomName from '../../utils/generateUniqueRoomName';
import {
  createMessage,
  uploadFile,
} from '../../features/messages/messagesSlice';

function SendMessagesForm({ socket, selectedUser }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const isSubmitDisabled = !newMessage;

  // Handle message submit
  function handleSubmit(e, formData = null) {
    e?.preventDefault();

    // Data accompaning each text
    const messageRoom = generateUniqueRoomName(user._id, selectedUser._id);
    const data = {
      time: Date.now(),
      sender: user._id,
      recipient: selectedUser._id,
      isRead: false,
    };
    const { time, sender, recipient } = data;

    if (!formData) {
      // Message data
      const messageData = {
        id: Date.now(),
        time,
        sender,
        recipient,
        text: newMessage,
        file: null,
      };

      // Send text to server
      socket.emit('newMessage', { messageRoom, messageData });
      dispatch(createMessage(messageData));

      // Clear newMessage state
      setNewMessage('');
    } else {
      formData.append('time', time);
      formData.append('sender', sender);
      formData.append('recipient', recipient);
      formData.append('text', null);
      formData.append('messagroom', messageRoom);

      // Send file to server
      const messageData = { text: null };
      socket.emit('newMessage', { messageRoom, messageData });
      dispatch(uploadFile(formData));
    }

    // Send notification to server
    socket.emit('newNotification', { messageRoom, data });
  }

  // Send file
  async function sendFile(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    handleSubmit(null, formData);
  }

  return (
    <form onSubmit={handleSubmit} className="send-form">
      <label htmlFor="file">
        <IoAttachOutline size={24} />
      </label>
      <input
        type="file"
        name="file"
        id="file"
        accept=".jpeg, .png, .jpg"
        onChange={sendFile}
      />
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message here"
      />
      <button disabled={isSubmitDisabled}>
        <IoSendSharp color="#4299e1" size={25} />
      </button>
    </form>
  );
}

export default SendMessagesForm;
