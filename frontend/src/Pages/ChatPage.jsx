"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useAuth } from "../Context/AuthContext"
import io from "socket.io-client"
import "./ChatPage.css"

const ChatPage = () => {
  const { sellerId } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [seller, setSeller] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)

  // Connect to socket.io server
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to chat with sellers")
      navigate("/auth/login")
      return
    }

    // Connect to socket server
    const socketInstance = io("http://localhost:5000", {
      auth: {
        token,
      },
    })

    socketInstance.on("connect", () => {
      console.log("Connected to socket server")

      // Join a room based on the conversation ID (user1_user2)
      const roomId = [currentUser?.id, sellerId].sort().join("_")
      socketInstance.emit("join_room", roomId)

      // Load previous messages
      fetchMessages(roomId)
    })

    socketInstance.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err)
      toast.error("Failed to connect to chat server")
    })

    setSocket(socketInstance)

    // Fetch seller details
    fetchSellerDetails()

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [currentUser, sellerId, navigate])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchSellerDetails = async () => {
    try {
      setIsLoading(true)
      // Replace with actual API call when ready
      // const response = await axios.get(`/api/users/${sellerId}`);
      // setSeller(response.data);

      // For now, use mock data
      setTimeout(() => {
        setSeller({
          id: sellerId,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+91 9876543210",
          profileImage: "/placeholder.svg",
          rating: 4.5,
        })
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching seller details:", error)
      toast.error("Failed to load seller details")
      setIsLoading(false)
    }
  }

  const fetchMessages = async (roomId) => {
    try {
      // Replace with actual API call when ready
      // const response = await axios.get(`/api/messages/${roomId}`);
      // setMessages(response.data);

      // For now, use mock data
      setMessages([
        {
          id: 1,
          sender: sellerId,
          content: "Hello, I'm interested in your product",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 2,
          sender: currentUser?.id,
          content: "Hi there! What would you like to know?",
          timestamp: new Date(Date.now() - 3000000).toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to load messages")
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    if (socket) {
      const roomId = [currentUser?.id, sellerId].sort().join("_")
      const messageData = {
        conversationId: roomId,
        sender: currentUser?.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
      }

      socket.emit("send_message", messageData)

      // Add message to local state
      setMessages((prevMessages) => [...prevMessages, messageData])

      // Clear input
      setNewMessage("")
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Seller Information</h5>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={seller.profileImage || "/placeholder.svg"}
                  alt={seller.name}
                  className="rounded-circle me-3"
                  width="60"
                  height="60"
                />
                <div>
                  <h6 className="mb-0">{seller.name}</h6>
                  <div className="text-warning">
                    <small>★ {seller.rating}</small>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="mb-1">Contact Information</h6>
                <p className="mb-1">
                  <i className="bi bi-envelope me-2"></i>
                  <a href={`mailto:${seller.email}`}>{seller.email}</a>
                </p>
                <p className="mb-0">
                  <i className="bi bi-telephone me-2"></i>
                  <a href={`tel:${seller.phone}`}>{seller.phone}</a>
                </p>
              </div>

              <button className="btn btn-outline-primary w-100" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Product
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Chat with {seller.name}</h5>
            </div>

            <div className="card-body chat-messages">
              <div className="messages-container">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender === currentUser?.id ? "sent" : "received"}`}>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <small className="message-time">{formatTime(message.timestamp)}</small>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="card-footer">
              <form onSubmit={handleSendMessage} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-send"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

