import React, { useState } from 'react';
import "../styles/MessageInput.css";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="message-input"
        placeholder="Type your message"
      />
      <button className="send-button" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
