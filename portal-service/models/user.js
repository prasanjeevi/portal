// user.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: Number,
    designation: Number,
    active: Boolean,
    apps: [String],
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User',userSchema);