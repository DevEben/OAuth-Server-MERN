const mongoose = require('mongoose');

const sessionStore = {
    async get(sid) {
        const session = await mongoose.model('Session').findOne({ _id: sid });
        return session ? session.data : null;
    },
    async set(sid, data) {
        const session = await mongoose.model('Session').findOneAndUpdate({ _id: sid }, { data }, { upsert: true });
        return session;
    },
    async destroy(sid) {
        await mongoose.model('Session').deleteOne({ _id: sid });
    },
};

module.exports = sessionStore;
