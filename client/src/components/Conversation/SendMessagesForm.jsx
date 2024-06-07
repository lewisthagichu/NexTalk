import getSocket from '../../utils/socket';
import { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ChatContext } from '../../context/ChatContext';
import { IoAttachOutline, IoSendSharp } from 'react-icons/io5';

import { addMessage } from '../../features/messages/messagesSlice';
import { generateUniqueRoomName } from '../../utils/usersServices';

const SendMessagesForm = () => {
  const { selectedUser } = useContext(ChatContext);
  const { user } = useSelector((state) => state.auth);
  const { isError, serverMessage } = useSelector((state) => state.messages);
  const [socket, setSocket] = useState(null);
  const [newText, setNewText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket(user.token);
    setSocket(socket);
  }, [user]);

  // Send file
  function sendFile(e) {
    const file = e.target.files[0];

    if (!file) {
      console.log('No file selected');
      return;
    }

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = () => {
      // const fileBuffer = event.target.result;

      const fileData = {
        fileType: file.type,
        fileBuffer: reader.result,
        fileExtension,
      };
      handleSubmit(null, fileData);
    };

    reader.onerror = (error) => {
      console.error('File reading error:', error);
    };

    reader.readAsDataURL(file);
  }

  // Handle message submit
  function handleSubmit(e, file = null) {
    if (e) e.preventDefault();

    // Data accompaning each text
    const messageRoom = generateUniqueRoomName(user._id, selectedUser._id);
    console.log(`The room the message was sent is: ${messageRoom}`);

    const data = {
      sender: user._id,
      recipient: selectedUser._id,
      text: null,
      time: Date.now(),
      messageRoom,
      _id: Date.now(),
    };
    let messageData;

    if (file) {
      const fileName = `${data.time}.${file.fileExtension}`;
      const formData = { data, file, fileName };

      messageData = { formData, messageRoom, textData: null };
      console.log(formData);

      dispatch(addMessage({ ...data, file: fileName }));
    } else {
      const textData = {
        ...data,
        text: newText,
        file: null,
      };

      messageData = { textData, messageRoom, formData: null };

      dispatch(addMessage(textData));

      setNewText('');
    }

    // Send message to server
    socket.emit('newMessage', messageData);

    // Send notification to server
    // socket.emit('newNotification', { messageRoom, data });
  }

  if (isError) {
    toast.error(serverMessage);
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
        accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.pdf,.mp3,.wav,.doc,.docx"
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
