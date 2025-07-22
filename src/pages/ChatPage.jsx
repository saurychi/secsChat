import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import UsernameModal from "../components/UsernameModal";
import "../styles/ChatPage.css";
import { encrypt, decrypt } from "../utils/cryptoPipeline";

const socket = io("http://localhost:3001");

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

useEffect(() => {
  socket.on("message", (msg) => {

    console.log("Incoming Message:", msg);
    console.log("Ciphertext:", msg.text);

    const decryptedText = decrypt(msg.text);

    console.log("Decrypted:", decryptedText);
    setMessages((prev) => [...prev, { ...msg, text: decryptedText }]);
  });

  return () => socket.off("message");
}, []);

  const handleJoin = (name) => {
    setUsername(name);
    setHasJoined(true);
  };

const sendMessage = (text) => {
  if (text.trim()) {
    const encryptedText = encrypt(text);

    console.log("Encrypted:", encryptedText);

    const msg = { sender: username, text: encryptedText };
    socket.emit("message", msg);

  }
};

  if (!hasJoined) {
    return <UsernameModal onSubmit={handleJoin} />;
  }

  return (
    <div className="chat-container">
      <h2 className="chat-title">Welcome to SecsChat!</h2>
      <p className="chat-subtitle">
        Connected as: <strong>{username}</strong>
      </p>
      <ChatBox messages={messages} username={username} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatPage;
