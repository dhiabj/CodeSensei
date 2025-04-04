const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
