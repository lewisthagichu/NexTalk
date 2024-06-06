import axios from 'axios';

const API_URL = '/api/notification/';
export const getNotifications = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL, config);

    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getUnreadNotifications = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
};
