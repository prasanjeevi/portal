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

app.use(auth); // <= order is important - have to be first route
app.use('/api', apps);
app.use('/api', user);

app.get('/', (req, res) => {
    res.send(config.message);
});

app.listen(port, function () {
  console.log('API app listening on port', port);
});