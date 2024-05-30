import axios from 'axios';

const API_URL = '/api/users/';

// Register new user
const register = async (userData) => {
  const { data } = await axios.post(API_URL, userData);

  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// Login to existing account
const login = async (userData) => {
  const { data } = await axios.post(API_URL + 'login', userData);

  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// Get all users from the database
const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + 'contacts', config);

  return data;
};

// Regenerate new token
const regenerateToken = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.post(API_URL + 'newToken', config);

  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// Logout
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  getUsers,
  logout,
  regenerateToken,
};

export default authService;
