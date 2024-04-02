// Generate room name
export default function generateUniqueRoomName(id1, id2) {
  // Sort the IDs alphabetically
  const sortedIds = [id1, id2].sort();

  // Concatenate the sorted IDs to create a unique room name
  const roomName = sortedIds.join('-');

  return roomName;
}
