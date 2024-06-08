import axios from 'axios';

const API_URL = '/api/notifications/';

// Get notifications received while offline
export const getNotifications = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL, config);

    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Mark as read all notifications from selected user/contact
export const markAsRead = async (selectedUserId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(
      API_URL + 'markRead/' + selectedUserId,
      {},
      config
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
