const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const personaRoutes = require('./routes/personaRoutes'); // Combined routes
app.use('/api', personaRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
