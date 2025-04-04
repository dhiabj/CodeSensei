const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.options('*', cors());
app.use(express.json());

// Routes
const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes);
app.use(express.static('public'));

module.exports = app;
