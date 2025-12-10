const express = require('express');
const cors = require('cors');        
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',    
  credentials: true,                   
}));

app.use(express.json());

// your routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/reports', reportRoutes);

module.exports = app;