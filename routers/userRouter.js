const express = require('express');
const router = express.Router();
const passport = require("../helpers/socialLogin");
const userModel = require('../models/userModel'); // Adjust the path to your user model

// Endpoint to initiate Google login
router.get('/auth/google', passport.authenticate("google", { scope: ["email", "profile"] }));

// Google callback route
router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL + "/auth/google/success",
    failureRedirect: process.env.CLIENT_URL + "/auth/google/failure"
}));

// Success route
router.get("/auth/google/success", (req, res) => {
    if (req.user) {
        const username = req.user.email;
        // Ensure req.session is initialized
        req.session = req.session || {};
        req.session.user = { username };

        // Redirect to the client URL
        return res.redirect(process.env.CLIENT_URL + '/');
    } else {
        return res.redirect("/auth/google/failure");
    }
});

// Failure route
router.get("/auth/google/failure", (req, res) => {
    return res.status(401).json("Authentication failed");
});

// Endpoint to retrieve authenticated user data
router.get("/auth/user", (req, res) => {
    if (req.session.user) {
        userModel.findOne({ email: req.session.user.username })
            .then(user => {
                if (user) {
                    return res.status(200).json({
                        message: "User data retrieved successfully",
                        data: user
                    });
                } else {
                    return res.status(404).json({ message: "User not found" });
                }
            })
            .catch(err => res.status(500).json({ message: "Server error", error: err }));
    } else {
        return res.status(401).json({ message: "User not authenticated" });
    }
});

// Initiate Twitter login
router.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter callback route
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: process.env.CLIENT_URL + '/auth/twitter/success',
    failureRedirect: process.env.CLIENT_URL + '/auth/twitter/failure'
}));

// Success route
router.get('/auth/twitter/success', (req, res) => {
    if (req.user) {
        const username = req.user.email;
        // Ensure req.session is initialized
        req.session = req.session || {};
        req.session.user = { username };

        // Redirect to the client URL
        return res.redirect(process.env.CLIENT_URL + '/');
    } else {
        return res.redirect('/auth/twitter/failure');
    }
});

// Failure route
router.get('/auth/twitter/failure', (req, res) => {
    return res.status(401).json('Authentication failed');
});

module.exports = router;
