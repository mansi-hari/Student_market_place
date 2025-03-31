"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Row, Col, Card, Form, Button, Badge } from "react-bootstrap"
import { FaComments, FaUser, FaPaperPlane, FaTrash } from "react-icons/fa"
import { toast } from "react-hot-toast"

const MyMessages = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/messages/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setConversations(response.data)

      // Auto-select the first conversation if available
      if (response.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data[0])
        fetchMessages(response.data[0]._id)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
      toast.error("Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true)
      const token = localStorage.getItem("token")
      const response = await axios.get(`http://localhost:5000/api/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setMessages(response.data)

      // Mark messages as read
      markAsRead(conversationId)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to load messages")
    } finally {
      setLoadingMessages(false)
    }
  }

  const markAsRead = async (conversationId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:5000/api/messages/${conversationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update the unread count in the conversations list
      setConversations(conversations.map((conv) => (conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:5000/api/messages",
        {
          conversationId: selectedConversation._id,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Add the new message to the messages list
      setMessages([...messages, response.data])

      // Clear the input field
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    }
  }

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation._id)
  }

  const deleteConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/messages/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Remove the conversation from the list
      setConversations(conversations.filter((conv) => conv._id !== conversationId))

      // Clear selected conversation if it was deleted
      if (selectedConversation && selectedConversation._id === conversationId) {
        setSelectedConversation(null)
        setMessages([])
      }

      toast.success("Conversation deleted")
    } catch (error) {
      console.error("Error deleting conversation:", error)
      toast.error("Failed to delete conversation")
    }
  }

  const getOtherParticipant = (conversation) => {
    if (!conversation || !user) return null
    return conversation.participants.find((p) => p._id !== user._id)
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <FaComments />
        </div>
        <h3>No Messages</h3>
        <p>You don't have any conversations yet.</p>
      </div>
    )
  }

  return (
    <div className="my-messages">
      <h3 className="mb-4">My Messages</h3>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header>Conversations</Card.Header>
            <div className="conversation-list">
              {conversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation)
                return (
                  <div
                    key={conversation._id}
                    className={`conversation-item ${
                      selectedConversation && selectedConversation._id === conversation._id ? "active" : ""
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="conversation-avatar">
                      {otherParticipant?.profileImage ? (
                        <img
                          src={`http://localhost:5000/uploads/${otherParticipant.profileImage}`}
                          alt={otherParticipant.name}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://via.placeholder.com/40"
                          }}
                        />
                      ) : (
                        <div className="default-avatar">
                          <FaUser />
                        </div>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-name">
                        {otherParticipant?.name || "Unknown User"}
                        {conversation.unreadCount > 0 && (
                          <Badge bg="danger" pill className="ms-2">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="conversation-preview">
                        {conversation.lastMessage?.content
                          ? conversation.lastMessage.content.substring(0, 30) +
                            (conversation.lastMessage.content.length > 30 ? "..." : "")
                          : "No messages yet"}
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="conversation-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConversation(conversation._id)
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )
              })}
            </div>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="message-container">
            {selectedConversation ? (
              <>
                <Card.Header>
                  <div className="d-flex align-items-center">
                    <div className="message-header-avatar">
                      {getOtherParticipant(selectedConversation)?.profileImage ? (
                        <img
                          src={`http://localhost:5000/uploads/${
                            getOtherParticipant(selectedConversation).profileImage
                          }`}
                          alt={getOtherParticipant(selectedConversation).name}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://via.placeholder.com/40"
                          }}
                        />
                      ) : (
                        <div className="default-avatar">
                          <FaUser />
                        </div>
                      )}
                    </div>
                    <div className="ms-2">
                      <h5 className="mb-0">{getOtherParticipant(selectedConversation)?.name || "Unknown User"}</h5>
                    </div>
                  </div>
                </Card.Header>
                <div className="message-list">
                  {loadingMessages ? (
                    <div className="text-center p-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-3 text-muted">No messages yet</div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`message-bubble ${message.sender === user?._id ? "outgoing" : "incoming"}`}
                      >
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Card.Footer>
                  <Form onSubmit={handleSendMessage}>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" variant="primary" className="ms-2">
                        <FaPaperPlane />
                      </Button>
                    </div>
                  </Form>
                </Card.Footer>
              </>
            ) : (
              <div className="text-center p-5 text-muted">
                <FaComments size={40} className="mb-3" />
                <h5>Select a conversation to view messages</h5>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .conversation-list {
          max-height: 500px;
          overflow-y: auto;
        }
        
        .conversation-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          position: relative;
        }
        
        .conversation-item:hover {
          background-color: #f8f9fa;
        }
        
        .conversation-item.active {
          background-color: #e9ecef;
        }
        
        .conversation-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;
        }
        
        .conversation-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .default-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #6c757d;
          color: white;
        }
        
        .conversation-info {
          flex: 1;
        }
        
        .conversation-name {
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        
        .conversation-preview {
          font-size: 0.85rem;
          color: #6c757d;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .conversation-delete {
          color: #dc3545;
          padding: 5px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .conversation-item:hover .conversation-delete {
          opacity: 1;
        }
        
        .message-container {
          display: flex;
          flex-direction: column;
          height: 500px;
        }
        
        .message-header-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .message-list {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
        }
        
        .message-bubble {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 18px;
          margin-bottom: 10px;
          position: relative;
        }
        
        .message-bubble.incoming {
          align-self: flex-start;
          background-color: #f1f0f0;
          border-bottom-left-radius: 5px;
        }
        
        .message-bubble.outgoing {
          align-self: flex-end;
          background-color: #dcf8c6;
          border-bottom-right-radius: 5px;
        }
        
        .message-content {
          word-break: break-word;
        }
        
        .message-time {
          font-size: 0.7rem;
          color: #6c757d;
          text-align: right;
          margin-top: 5px;
        }
      `}</style>
    </div>
  )
}

export default MyMessages

