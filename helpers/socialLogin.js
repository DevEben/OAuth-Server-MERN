// // socialLogin.js
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth2").Strategy;
// const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel")

// const jwtSecret = process.env.SECRET; // Change this to a secure secret in production

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL
// },
//     async (accessToken, refreshToken, profile, done) => {
//         // Here, you can save the user to your database if necessary
//         try {
//             let user = await userModel.findOne({ email: profile.email });
//             if (!user) {
//                 user = await userModel.create({
//                     firstName: profile.given_name,
//                     lastName: profile.family_name,
//                     email: profile.email,
//                     profilePicture: { url: profile.photos[0].value, public_id: Date.now() },
//                     isVerified: profile.email_verified,
//                 });
//             }
//             return done(null, user);
//         } catch (error) {
//             return done(error, false);
//         }
//     }));

// passport.serializeUser((user, done) => {
//     done(null, user._id);
// });

// passport.deserializeUser((id, done) => {
//     userModel.findById(id, (err, user) => {
//         done(err, user);
//     });
// });


// module.exports = {
//     generateToken: (user) => {
//         return jwt.sign({ user }, jwtSecret, { expiresIn: "1h" });
//     },
//     authenticate: passport.authenticate("google", { scope: ["profile", "email"] }),
//     callback: passport.authenticate("google", { session: false })
// };





// helpers/socialLogin.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const userModel = require('../models/userModel'); // Import User model

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user._id); // Serialize the user by their unique MongoDB ID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
},
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user exists
            const existingUser = await userModel.findOne({ email: profile.emails[0].value });

            if (existingUser) {
                return done(null, existingUser); // Existing user found
            }

            // Create a new user
            const newUser = new userModel({
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profilePicture: { url: profile.photos[0].value, public_id: Date.now() },
                isVerified: true, // Assume email is verified if using Google
            });

            await newUser.save(); // Save the new user
            done(null, newUser); // Return new user
        } catch (err) {
            done(err, null);
        }
    }
));

// Twitter OAuth Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    includeEmail: true, // Request email access
},
    async (token, tokenSecret, profile, done) => {
        try {
            console.log("Twitter User Profile: ", profile); // Log the profile for debugging
            const twitterId = profile.id;
            const email = profile.emails ? profile.emails[0].value : null; // Handle missing email

            const existingUser = await userModel.findOne({
                $or: [{ email: email }, { twitterId: twitterId }]
            });

            if (existingUser) {
                return done(null, existingUser); // Existing user found
            }

            // Create a new user
            const newUser = new userModel({
                twitterId: twitterId,
                email: email,
                firstName: profile.displayName.split(' ')[0],
                lastName: profile.displayName.split(' ')[1] || '',
                profilePicture: { url: profile.photos[0].value, public_id: Date.now() },
                isVerified: true, // Assume email is verified if using Twitter
            });

            await newUser.save(); // Save the new user
            done(null, newUser); // Return new user
        } catch (err) {
            console.error("Error during Twitter login: ", err); // Log any errors
            done(err, null);
        }
    }
));

module.exports = passport;
