const socket = io('http://localhost:4000');

socket.on('messageSent', (message) => {
  console.log('Message sent:', message);
});

socket.on('messageUpdated', (message) => {
  console.log('Message updated:', message);
});

socket.on('messageDeleted', (message) => {
  console.log('Message deleted:', message);
});

socket.emit('sendMessage', {
  roomId: 'someid',
  author: 'Author',
  content: 'Test message',
});
