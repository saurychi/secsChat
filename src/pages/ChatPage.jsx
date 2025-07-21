import { useEffect, useState } from "react";
import socket from "../socket";
import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import UsernameModal from "../components/UsernameModal";
import "../styles/ChatPage.css";
import "../styles/UsernameModal.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("message");
  }, []);

  const sendMessage = (text) => {
    if (text.trim()) {
      socket.emit("message", { sender: username, text });
    }
  };

  if (!username) {
    return <UsernameModal onSubmit={setUsername} />;
  }

  return (
    <div className="chat-container">
      <h2 className="chat-title">
        Welcome to SecsChat!
      </h2>
      <span>Connected as: {username}</span>
      <ChatBox messages={messages} username={username} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatPage;
