export const getUnreadNotifications = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
};
