// persistence/mongo.js

const mongoose = require('mongoose');
const config = require('../config.json');

mongoose.Promise = global.Promise;
// For local mongodb
//mongoose.connect(process.env.DB || config.mongodb);

// For mlabs
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.connect(process.env.DB || config.mongodb, options);