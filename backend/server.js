const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

require('./config/passport');

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
const authRoutes = require('./routes/auth.routes');
const reviewRoutes = require('./routes/review.routes');

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
