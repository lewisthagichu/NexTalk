export function formatNotificationDate(createdAt) {
  const now = new Date();
  const notificationDate = new Date(createdAt);

  const timeDifference = now - notificationDate;
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;

  if (timeDifference < oneDay) {
    // Check if it's today
    return notificationDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (timeDifference < 2 * oneDay) {
    // Check if it's yesterday
    return 'yesterday';
  } else if (timeDifference < sevenDays) {
    // Check if it's within the last 7 days
    const dayOfWeek = notificationDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    return dayOfWeek;
  } else {
    // Check if it's past the last 7 days
    return notificationDate.toLocaleDateString('en-GB');
  }
}

export function extractTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function extractDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // 'en-GB' specifies the date format as DD/MM/YYYY
}
