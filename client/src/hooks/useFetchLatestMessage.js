import { useContext, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ChatContext } from '../context/ChatContext';

const API_URL = '/api/messages/';

function useFetchLatestMessage(contactId) {
  const [latestMessage, setLatestMessage] = useState(null);
  const { notifications } = useContext(ChatContext);
  const { user } = useSelector((state) => state.auth);

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }),
    [user.token]
  );

  useEffect(() => {
    const getContactMessages = async () => {
      const response = await axios.get(API_URL + contactId, config);

      if (response.error) {
        return console.log('Error: ' + response.error);
      }

      const latestMessage = response[response?.length - 1];

      console.log(response.data[1]);

      setLatestMessage(latestMessage);
    };
    getContactMessages();
  }, [notifications, contactId, config]);

  return { latestMessage };
}

export default useFetchLatestMessage;
