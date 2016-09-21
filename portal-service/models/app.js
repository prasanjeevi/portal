// app.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var appSchema = new Schema({
    name: String,
    description: String,
    version: String,
    stage: Number,
    category: Number,
    icon: String,
    active: Boolean,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('App',appSchema);