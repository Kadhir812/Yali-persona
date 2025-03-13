const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './src/.env' });

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const addPersonaRoute = require('./routes/addPersona');
app.use('/api/add', addPersonaRoute);

const personaCountsRoute = require('./routes/personaCounts');
app.use('/api/persona-counts', personaCountsRoute);

const allPersonasRoute = require('./routes/allPersonas');
app.use('/api', allPersonasRoute); // Ensure the base path matches the route definition

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});