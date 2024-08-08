// sessionStore.js
const { EventEmitter } = require('events');
const Session = require('../models/sessionModel'); // Import the Session model

class SessionStore extends EventEmitter {
  async get(sid) {
    try {
      const session = await Session.findOne({ _id: sid });
      return session ? session.data : null; // Return session data or null if not found
    } catch (err) {
      console.error('Error fetching session:', err);
      return null; // Return null in case of an error
    }
  }
  async set(sid, data) {
    try {
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now
      const session = await Session.findOneAndUpdate(
        { _id: sid },
        { data, expires },
        { upsert: true, new: true, setDefaultsOnInsert: true } // Options for upsert
      );
      return session;
    } catch (err) {
      console.error('Error saving session:', err);
      return null; // Return null in case of an error
    }
  }
  async destroy(sid) {
    try {
      await Session.deleteOne({ _id: sid });
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  }
};

module.exports = new SessionStore();

