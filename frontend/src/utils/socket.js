import io from "socket.io-client"

let socket

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect()
  }

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000"

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  })

  socket.on("connect", () => {
    console.log("Connected to socket server")
  })

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err)
  })

  return socket
}

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token")
    if (token) {
      return initializeSocket(token)
    }
    return null
  }
  return socket
}

export const joinChatRoom = (roomId) => {
  const socket = getSocket()
  if (socket) {
    socket.emit("join_room", roomId)
  }
}

export const sendMessage = (roomId, message) => {
  const socket = getSocket()
  if (socket) {
    socket.emit("send_message", {
      conversationId: roomId,
      ...message,
    })
  }
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

