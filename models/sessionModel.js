// models/sessionModel.js

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  _id: String, // Session ID as the primary key
  data: Object, // Session data
  expires: Date, // Expiry date for the session
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
