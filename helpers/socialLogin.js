require("dotenv").config();
const express = require("express");
const session = require('express-session');
const app = express();
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const userModel = require('../models/userModel'); // Adjust the path to your user model


// MongoDB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Session configuration with MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Only create session when something is stored
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE, // MongoDB connection URI
        collectionName: 'sessions' // Collection name to store sessions
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
        httpOnly: true, // Mitigates XSS attacks
        sameSite: 'none', // Enable cross-site cookies for different origins
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

// Passport Serialization and Deserialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Set up Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile.email });
            if (!user) {
                user = await userModel.create({
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    email: profile.email,
                    profilePicture: { url: profile.photos[0].value, public_id: Date.now() },
                    isVerified: profile.email_verified,
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));

// Set up Twitter strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    includeEmail: true // Include email if available
},
    async (token, tokenSecret, profile, done) => {
        try {
            const email = profile.emails ? profile.emails[0].value : null;
            let user = await userModel.findOne({ email });

            if (!user) {
                user = await userModel.create({
                    firstName: profile.displayName.split(' ')[0] || '',
                    lastName: profile.displayName.split(' ')[1] || '',
                    email: email || '',
                    profilePicture: { url: profile.photos ? profile.photos[0].value : '', public_id: Date.now() },
                    isVerified: email ? true : false,
                });
            }

            return done(null, user);
        } catch (error) {
            console.error('Error in Twitter strategy:', error);
            return done(error, false);
        }
    }));

module.exports = passport;
