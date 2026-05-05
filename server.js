const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app); // ← wrap express with http

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', skillRoutes);
app.use('/api/user', userRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a private room between two users
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Send message
  socket.on('send_message', async (data) => {
    const { roomId, senderId, receiverId, message } = data;

    // Save to DB
    const Message = require('./models/Message');
    const newMessage = await Message.create({
      roomId,
      sender: senderId,
      receiver: receiverId,
      message
    });

    // Emit to everyone in the room
    io.to(roomId).emit('receive_message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(5000, () => console.log('Server running on port 5000')); // ← server not app
  })
  .catch(err => console.log("DB Connection Error:", err));