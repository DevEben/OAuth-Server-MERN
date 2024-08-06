// routes.js
const express = require("express");
const { authenticate, callback, generateToken } = require("../helpers/socialLogin");
const router = express.Router();
const userModel = require("../models/userModel"); // Replace with your actual user model
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.SECRET; // Change this to a secure secret in production

router.get("/auth/google", authenticate);

router.get("/auth/google/callback", callback, (req, res) => {
    const token = generateToken(req.user);

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/', // Ensure the path is correct
        domain: '.spiraltech.onrender.com',
    };

    // Set cookie and log the event
    res.cookie("jwt", token, cookieOptions);
    res.redirect(process.env.CLIENT_URL); // Redirect to your frontend
});

router.get("/auth/user", (req, res) => {
    const token = req.cookies.jwt;
    console.log("jwt: " + token)
    if (!token) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
            userModel.findById(decoded.user._id) // Replace with your actual user lookup logic
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
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});

module.exports = router;