export function generateRoomId(userId1, userId2) {
  return ["chat", ...[userId1, userId2].sort()].join(":");
}
