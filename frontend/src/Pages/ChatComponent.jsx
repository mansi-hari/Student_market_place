import React from "react";
import ChatInterface from "./ChatComponent"; // Import the actual chat interface component

const ChatComponent = ({ sellerInfo }) => {
  if (!sellerInfo) return null; // Prevent errors before data loads

  return (
    <div className="chat-box">
      <h4>Chat with {sellerInfo.name}</h4>
      <p>📞 {sellerInfo.phone}</p>
      <p>📧 {sellerInfo.email}</p>
      <ChatInterface sellerId={sellerInfo._id} />
    </div>
  );
};

export default ChatComponent;
