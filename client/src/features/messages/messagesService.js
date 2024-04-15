import axios from 'axios';

const API_URL = '/api/messages/';

// Post create message request to server
const createMessage = async (messageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(API_URL, messageData, config);

  return data;
};

// Post upload file request to server
const uploadFile = async (formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(API_URL + 'upload', formData, config);

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
  uploadFile,
  getMessages,
};

export default messagesService;
