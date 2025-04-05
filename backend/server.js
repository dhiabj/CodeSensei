const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const aiRoutes = require('./routes/ai.routes');
const userRoutes = require('./routes/user.routes');
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
