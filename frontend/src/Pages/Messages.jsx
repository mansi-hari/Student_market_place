"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Send,
  Search,
  Phone,
  Info,
  ArrowLeft,
  MoreVertical,
  User,
  Check,
  CheckCheck,
  X,
  MapPin,
  Mail,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { useAuth } from "../Context/AuthContext"

const Messages = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const messagesEndRef = useRef(null)

  // Sample conversations data
  const sampleConversations = [
    {
      id: 1,
      user: {
        id: 101,
        name: "Rahul Kumar",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        lastSeen: "2 min ago",
        phone: "+91-9876543210",
        email: "rahul@example.com",
        rating: 4.8,
        memberSince: "Jan 2023",
        location: "Delhi",
      },
      lastMessage: {
        text: "Is the laptop still available?",
        timestamp: "10:42 AM",
        isRead: true,
        sender: "them",
      },
      unreadCount: 0,
      product: {
        id: 201,
        title: "Lenovo LOQ Intel Core i7 13th Gen",
        price: 90000,
        image: "https://v0.blob.com/laptop.png",
      },
    },
    {
      id: 2,
      user: {
        id: 102,
        name: "Priya Singh",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        lastSeen: "Online",
        phone: "+91-9876543211",
        email: "priya@example.com",
        rating: 4.5,
        memberSince: "Mar 2023",
        location: "Mumbai",
      },
      lastMessage: {
        text: "Can you deliver the book to campus?",
        timestamp: "Yesterday",
        isRead: false,
        sender: "them",
      },
      unreadCount: 2,
      product: {
        id: 202,
        title: "Calculus Early Transcendentals",
        price: 45,
        image: "https://v0.blob.com/book.png",
      },
    },
    {
      id: 3,
      user: {
        id: 103,
        name: "Amit Patel",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        lastSeen: "5 hours ago",
        phone: "+91-9876543212",
        email: "amit@example.com",
        rating: 4.9,
        memberSince: "Feb 2023",
        location: "Bangalore",
      },
      lastMessage: {
        text: "I'm interested in the desk. Can we meet tomorrow?",
        timestamp: "Yesterday",
        isRead: true,
        sender: "you",
      },
      unreadCount: 0,
      product: {
        id: 203,
        title: "Modern Study Desk",
        price: 1000,
        image: "https://v0.blob.com/desk.png",
      },
    },
    {
      id: 4,
      user: {
        id: 104,
        name: "Sneha Gupta",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        lastSeen: "2 days ago",
        phone: "+91-9876543213",
        email: "sneha@example.com",
        rating: 4.7,
        memberSince: "Apr 2023",
        location: "Hyderabad",
      },
      lastMessage: {
        text: "The bike is in excellent condition. Let me know if you want to see it.",
        timestamp: "2 days ago",
        isRead: true,
        sender: "them",
      },
      unreadCount: 0,
      product: {
        id: 204,
        title: "Mountain Bike",
        price: 275,
        image: "https://v0.blob.com/bike.png",
      },
    },
  ]

  // Sample messages for conversation 1
  const sampleMessages = [
    {
      id: 1,
      text: "Hi, I'm interested in the Lenovo laptop you posted.",
      timestamp: "10:30 AM",
      sender: "them",
      isRead: true,
    },
    {
      id: 2,
      text: "Hello! Yes, it's still available.",
      timestamp: "10:35 AM",
      sender: "you",
      isRead: true,
    },
    {
      id: 3,
      text: "Great! What's the battery life like?",
      timestamp: "10:38 AM",
      sender: "them",
      isRead: true,
    },
    {
      id: 4,
      text: "The battery lasts about 6-7 hours with normal use. It's in excellent condition, I've only had it for 3 months.",
      timestamp: "10:40 AM",
      sender: "you",
      isRead: true,
    },
    {
      id: 5,
      text: "Is the laptop still available?",
      timestamp: "10:42 AM",
      sender: "them",
      isRead: true,
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch conversations
    setIsLoading(true)
    setTimeout(() => {
      setConversations(sampleConversations)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Scroll to bottom of messages when messages change or conversation changes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeConversation])

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation)

    // Simulate API call to fetch messages for this conversation
    setTimeout(() => {
      // For demo purposes, only show messages for conversation 1
      if (conversation.id === 1) {
        setMessages(sampleMessages)
      } else {
        // Generate some placeholder messages for other conversations
        const placeholderMessages = [
          {
            id: 1,
            text: `Hi, I'm interested in your ${conversation.product.title}.`,
            timestamp: "Earlier",
            sender: "them",
            isRead: true,
          },
          {
            id: 2,
            text: "Hello! Yes, it's still available.",
            timestamp: "Earlier",
            sender: "you",
            isRead: true,
          },
          {
            id: 3,
            text: conversation.lastMessage.text,
            timestamp: conversation.lastMessage.timestamp,
            sender: conversation.lastMessage.sender,
            isRead: conversation.lastMessage.isRead,
          },
        ]
        setMessages(placeholderMessages)
      }

      // Mark conversation as read
      if (conversation.unreadCount > 0) {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === conversation.id
              ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
              : conv,
          ),
        )
      }
    }, 500)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Add new message to the conversation
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: "Just now",
      sender: "you",
      isRead: false,
    }

    setMessages([...messages, newMsg])

    // Update the conversation's last message
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: {
                text: newMessage,
                timestamp: "Just now",
                isRead: false,
                sender: "you",
              },
            }
          : conv,
      ),
    )

    // Clear the input
    setNewMessage("")

    // Simulate a reply after a delay (for demo purposes)
    if (activeConversation.id === 1) {
      setTimeout(() => {
        const replyMsg = {
          id: messages.length + 2,
          text: "Thanks for the information. Can we meet tomorrow to check it out?",
          timestamp: "Just now",
          sender: "them",
          isRead: true,
        }

        setMessages((prevMessages) => [...prevMessages, replyMsg])

        // Update the conversation's last message
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === activeConversation.id
              ? {
                  ...conv,
                  lastMessage: {
                    text: replyMsg.text,
                    timestamp: replyMsg.timestamp,
                    isRead: true,
                    sender: "them",
                  },
                }
              : conv,
          ),
        )

        toast.success("New message received")
      }, 3000)
    }
  }

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (timestamp) => {
    // Simple formatter for demo purposes
    return timestamp
  }

  const handleCallUser = () => {
    if (activeConversation) {
      window.location.href = `tel:${activeConversation.user.phone}`
      toast.success("Initiating call...")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex h-[calc(80vh)]">
          {/* Conversations List */}
          <div className={`w-full md:w-1/3 border-r ${activeConversation ? "hidden md:block" : ""}`}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(80vh-73px)]">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No conversations found</div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeConversation?.id === conversation.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="flex items-start">
                      <img
                        src={conversation.user.avatar || "/placeholder.svg"}
                        alt={conversation.user.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-semibold truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.sender === "you" ? "You: " : ""}
                          {conversation.lastMessage.text}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="w-8 h-8 rounded-md overflow-hidden mr-2">
                            <img
                              src={conversation.product.image || "/placeholder.svg"}
                              alt={conversation.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-gray-500 truncate flex-1">{conversation.product.title}</p>
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {activeConversation ? (
            <div className={`w-full md:w-2/3 flex flex-col ${!activeConversation ? "hidden md:flex" : ""}`}>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                    onClick={() => setActiveConversation(null)}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <img
                    src={activeConversation.user.avatar || "/placeholder.svg"}
                    alt={activeConversation.user.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{activeConversation.user.name}</h3>
                    <p className="text-xs text-gray-500">{activeConversation.user.lastSeen}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="p-2 rounded-full hover:bg-gray-100 mr-1" onClick={handleCallUser}>
                    <Phone size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 mr-1"
                    onClick={() => setShowUserInfo(!showUserInfo)}
                  >
                    <Info size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 bg-gray-50 border-b flex items-center">
                <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                  <img
                    src={activeConversation.product.image || "/placeholder.svg"}
                    alt={activeConversation.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{activeConversation.product.title}</h4>
                  <p className="text-sm font-bold">₹{activeConversation.product.price.toLocaleString()}</p>
                </div>
                <button
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => navigate(`/products/category/${activeConversation.product.id}`)}
                >
                  View
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "them" && (
                      <img
                        src={activeConversation.user.avatar || "/placeholder.svg"}
                        alt={activeConversation.user.name}
                        className="w-8 h-8 rounded-full mr-2 self-end object-cover"
                      />
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === "you"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <p>{message.text}</p>
                      <div
                        className={`text-xs mt-1 flex items-center ${
                          message.sender === "you" ? "text-blue-100 justify-end" : "text-gray-500"
                        }`}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === "you" && (
                          <span className="ml-1">
                            {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex w-2/3 items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                <p className="text-gray-500 mb-4">Select a conversation to start chatting</p>
              </div>
            </div>
          )}

          {/* User Info Sidebar */}
          {showUserInfo && activeConversation && (
            <div className="w-full md:w-1/4 border-l bg-white overflow-y-auto h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">User Info</h3>
                <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShowUserInfo(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 text-center">
                <img
                  src={activeConversation.user.avatar || "/placeholder.svg"}
                  alt={activeConversation.user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-semibold text-lg">{activeConversation.user.name}</h3>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{activeConversation.user.rating}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{activeConversation.user.lastSeen}</p>
              </div>

              <div className="p-4 border-t">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <User size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Member since</span>
                  </div>
                  <p className="text-sm">{activeConversation.user.memberSince}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <MapPin size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Location</span>
                  </div>
                  <p className="text-sm">{activeConversation.user.location}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Mail size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Email</span>
                  </div>
                  <p className="text-sm">{activeConversation.user.email}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Phone size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Phone</span>
                  </div>
                  <p className="text-sm">{activeConversation.user.phone}</p>
                </div>
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={handleCallUser}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-3"
                >
                  Call User
                </button>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${activeConversation.user.email}`
                    toast.success("Opening email client...")
                  }}
                  className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  Email User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Import this component to avoid errors
const MessageSquare = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}

export default Messages

