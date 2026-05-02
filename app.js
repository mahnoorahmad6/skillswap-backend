const express = require('express');
const cors = require('cors'); // 1. Import it
const app = express();

// 2. Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); 
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));