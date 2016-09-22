// persistence/mongo.js

const mongoose = require('mongoose');
const config = require('../config.json');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB || config.mongodb);