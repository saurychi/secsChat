import React from "react";
import "../styles/ChatBox.css";

const ChatBox = ({ messages, username }) => {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => {
        const isMe = msg.sender === username;
        return (
          <div
            key={index}
            className={`chat-message ${isMe ? "my-message" : "other-message"}`}
          >
            {!isMe && <div className="sender-name">{msg.sender}</div>}
            <div className="message-text">{msg.text}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
