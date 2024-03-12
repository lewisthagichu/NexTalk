import axios from 'axios';

const API_URL = '/api/messages/';

// Sent create message request to server
const createMessage = async (messageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(API_URL, messageData, config);

  return data;
};

// Get conversation with selected user/contact
const getMessages = async (selectedUserId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + selectedUserId, config);

  return response.data;
};

const messagesService = {
  createMessage,
  getMessages,
};

export default messagesService;
