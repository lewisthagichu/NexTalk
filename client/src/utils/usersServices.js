// Generate room name
export function generateUniqueRoomName(id1, id2) {
  // Sort the IDs alphabetically
  const sortedIds = [id1, id2].sort();

  // Concatenate the sorted IDs to create a unique room name
  const roomName = sortedIds.join('-');

  return roomName;
}

// Update online users array
export function updateOnlineUsers(users, myID) {
  // Find unique active users
  const connectedUsers = Array.from(new Set(users.map((obj) => obj.id))).map(
    (id) => users.find((obj) => obj.id === id)
  );

  // Exclude ourselves
  const connectedUsersExclMe = connectedUsers.filter(
    (connectedUser) => connectedUser._id !== myID
  );

  return connectedUsersExclMe;
}

const services = { generateUniqueRoomName, updateOnlineUsers };

export default services;
