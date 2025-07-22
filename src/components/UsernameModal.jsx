import { useState } from "react";
import "../styles/UsernameModal.css";

const UsernameModal = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="username-modal">
      <form onSubmit={handleSubmit} className="username-form">
        <h2>Enter your name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
};

export default UsernameModal;
