// app.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const auth = require('./routes/auth');
const apps = require('./routes/app');
const user = require('./routes/user');

const config = require('./config.json');
const port =  process.env.PORT || config.port;

require('./persistence/mongo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Email, Password, AuthToken");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
  next();
});

// Middleware for AUTH
app.use(auth); // <= order is important - have to be first route

// Functional Routes
app.use('/api', apps);
app.use('/api', user);

app.get('/', (req, res) => {
    res.send(config.message);
});

app.listen(port, function () {
  console.log('API app listening on port', port);
});