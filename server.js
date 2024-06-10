// Load the required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { config } = require('./src/config');
const routes = require('./src/routes');

// Create an instance of Express
const app = express();

// Define a port to run the server on
const PORT = config.port || 3000;

// Enable CORS
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers
// Available under the req.body property
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
