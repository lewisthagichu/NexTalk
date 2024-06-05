import getSocket from '../../utils/socket';
import { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChatContext } from '../../context/ChatContext';
import { IoAttachOutline, IoSendSharp } from 'react-icons/io5';
import { uploadFile } from '../../features/messages/messagesSlice';
import { addMessage } from '../../features/messages/messagesSlice';
import { generateUniqueRoomName } from '../../utils/usersServices';

const SendMessagesForm = () => {
  const { selectedUser } = useContext(ChatContext);
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [newText, setNewText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket(user.token);
    setSocket(socket);
  }, [user]);

  // Handle message submit
  function handleSubmit(e, file = null) {
    e?.preventDefault();

    // Data accompaning each text
    const messageRoom = generateUniqueRoomName(user._id, selectedUser._id);
    console.log(`The room the message was sent is: ${messageRoom}`);

    const data = {
      sender: user._id,
      recipient: selectedUser._id,
      time: Date.now(),
      messageRoom,
      isRead: false,
    };
    let messageData;

    if (file) {
      const formData = new FormData();
      const { time, sender, recipient } = data;

      formData.append('sender', sender);
      formData.append('recipient', recipient);
      formData.append('time', time);
      formData.append('messageroom', messageRoom);
      formData.append('file', file);
      formData.append('text', null);

      messageData = { formData, messageRoom, textData: null };

      dispatch(uploadFile(formData));
    } else {
      const textData = {
        ...data,
        text: newText,
        file: null,
        _id: Date.now(),
      };

      messageData = { textData, messageRoom, formData: null };

      dispatch(addMessage(textData));

      setNewText('');
    }

    // Send message to server
    socket.emit('newMessage', messageData);

    // Send notification to server
    socket.emit('newNotification', { messageRoom, data });
  }

  // Send file
  function sendFile(e) {
    const file = e.target.files[0];

    handleSubmit(null, file);
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
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder="Type your message here"
      />
      <button disabled={!newText}>
        <IoSendSharp color="#4299e1" size={25} />
      </button>
    </form>
  );
};

export default SendMessagesForm;
