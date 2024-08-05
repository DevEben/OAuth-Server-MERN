// socialLogin.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")

const jwtSecret = process.env.SECRET; // Change this to a secure secret in production

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    // Here, you can save the user to your database if necessary
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

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = {
    generateToken: (user) => {
        return jwt.sign({ user }, jwtSecret, { expiresIn: "1h" });
    },
    authenticate: passport.authenticate("google", { scope: ["profile", "email"] }),
    callback: passport.authenticate("google", { session: false })
};
