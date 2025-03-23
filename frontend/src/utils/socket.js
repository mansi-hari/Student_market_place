import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (token) => {
  if (!token) {
    console.error("No token provided for socket initialization");
  return null;
}

  // Close existing socket if it exists
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  // Create new socket connection
  socket = io(process.env.REACT_APP_API_URL.replace('/api', '') || 'http://localhost:5000', {
    auth: { token },
    transports: ["websocket"],
  });

  // Socket event listeners
  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('notification', (newNotification) => {
    console.log('New notification received:', newNotification);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    setTimeout(() => {
      socket.connect();
    }, 5000);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};

export const joinRoom = (roomId) => {
  if (socket) {
    socket.emit('join_room', roomId);
  }
};

export const leaveRoom = (roomId) => {
  if (socket) {
    socket.emit('leave_room', roomId);
  }
};

export const sendSocketMessage = (roomId, message) => {
  if (socket) {
    socket.emit('send_message', { conversationId: roomId, content: message });
  }
};

export const emitTyping = (roomId, isTyping) => {
  if (socket) {
    socket.emit('typing', { conversationId: roomId, isTyping });
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinRoom,
  leaveRoom,
  sendSocketMessage,
  emitTyping
};
