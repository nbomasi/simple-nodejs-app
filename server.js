// server.js (Backend)
const express = require('express');
const app = express();
const path = require('path');

// Serve static frontend files
app.use(express.static('public'));

// API endpoint
app.get('/api/message', (req, res) => {
  res.json({ message: "I am new to JavaScript - from the backend!" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

