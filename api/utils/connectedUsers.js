// Active users list
const users = [];

// Add user when they connecct
const userJoin = (_id, username) => {
  const user = {
    _id,
    username,
  };

  users.push(user);

  return user;
};

// Get all users
const getUsers = () => {
  return users;
};

// Remove a disconnected user from the list
function userLeave(id) {
  const index = users.findIndex((user) => user._id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  userJoin,
  getUsers,
  userLeave,
};
