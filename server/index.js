const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers.set(socket.id, userId);
    console.log(`User ${userId} joined`);
  });

  socket.on('update-task', (taskData) => {
    socket.broadcast.emit('task-updated', taskData);
  });

  socket.on('move-task', (moveData) => {
    socket.broadcast.emit('task-moved', moveData);
  });

  socket.on('add-task', (taskData) => {
    socket.broadcast.emit('task-added', taskData);
  });

  socket.on('delete-task', (data) => {
    socket.broadcast.emit('task-deleted', data);
  });

  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    console.log(`User ${userId} disconnected`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});