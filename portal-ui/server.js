'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 8000; 
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.send('index.html');
});

app.get('/ping', (req, res) => {
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`Portal-UI is running on port ${port}`);
});