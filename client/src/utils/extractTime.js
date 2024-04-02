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
