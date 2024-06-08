// Load the required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { config } = require('./src/config');

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

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
