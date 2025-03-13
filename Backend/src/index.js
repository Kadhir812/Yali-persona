
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const personaRoutes = require('./routes/persona');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use('/api/personas', personaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});