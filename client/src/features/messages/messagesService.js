import axios from 'axios';

const API_URL = '/api/messages/';

// Sent create message request to server
const createMessage = async (token, messageData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(API_URL, messageData, config);

  return data;
};

const messagesService = {
  createMessage,
};

export default messagesService;
