const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        url: {
            type: String
         },
        public_id:{
            type: String
        }
    },
    status: {
        type: String,
        default: 'active',
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String,
    },
    revealPass: {
        type: String,
    }

}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;