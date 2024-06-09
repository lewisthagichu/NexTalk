const sendNotificationToUsers = (notification, connectedUsers) => {
  const recipientSocket = connectedUsers.get(notification.recipient.toString());
  const senderSocket = connectedUsers.get(notification.sender.toString());

  if (recipientSocket) {
    recipientSocket.emit('notification', notification);
  }

  if (senderSocket) {
    senderSocket.emit('notification', notification);
  }
};

module.exports = { sendNotificationToUsers };
