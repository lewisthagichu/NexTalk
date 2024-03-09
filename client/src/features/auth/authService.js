import axios from 'axios';

const API_URL = '/api/users/';

const register = async (userData) => {
  const { data } = await axios.post(API_URL, userData);

  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

const login = async (userData) => {
  const { data } = await axios.post(API_URL + 'login', userData);

  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// const getProfile = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const { data } = await axios.get(API_URL + 'me', config);

//   return data;
// };

const authService = {
  register,
  login,
};

export default authService;
