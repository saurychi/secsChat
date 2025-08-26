const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

const sendMessage = () => {
  if (text.trim()) {
    const msg = { sender: username, text };
    setMessages((prev) => [...prev, msg]);
    socket.emit("message", msg);  
    setText("");
  }
};

