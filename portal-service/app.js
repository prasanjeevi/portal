// app.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const apps = require('./routes/app');
const config = require('./config.json');
const port =  process.env.PORT || config.port;

require('./persistence/mongo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apps);

app.get('/', (req, res) => {
    res.send(config.message);
});

app.listen(port, function () {
  console.log('API app listening on port', port);
});