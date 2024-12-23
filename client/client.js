const socket = io('http://localhost:3000');

socket.on('messageSent', (message) => {
  console.log('Message sent:', message);
});

socket.on('messageUpdated', (message) => {
  console.log('Message updated:', message);
});

socket.on('messageDeleted', (message) => {
  console.log('Message deleted:', message);
});

// To join a room:
fetch('/chat/room/someid/join', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userId: 'someUserId' }),
});

// To send a message:
socket.emit('sendMessage', {
  roomId: 'someid',
  author: 'Author',
  content: 'Test message',
});
