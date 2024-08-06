// // routes.js
// const express = require("express");
// const { authenticate, callback, generateToken } = require("../helpers/socialLogin");
// const router = express.Router();
// const userModel = require("../models/userModel"); // Replace with your actual user model
// const jwt = require("jsonwebtoken");

// const jwtSecret = process.env.SECRET; // Change this to a secure secret in production

// router.get("/auth/google", authenticate);

// router.get("/auth/google/callback", callback, (req, res) => {
//     const token = generateToken(req.user);

//     const cookieOptions = {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'None',
//         path: '/', // Ensure the path is correct
//         domain: '.spiraltech.onrender.com',
//     };

//     // Set cookie and log the event
//     res.cookie("jwt", token, cookieOptions);
//     res.redirect(process.env.CLIENT_URL); // Redirect to your frontend
// });

// router.get("/auth/user", (req, res) => {
//     const token = req.cookies.jwt;
//     console.log("jwt: " + token)
//     if (!token) {
//         return res.status(401).json({ message: "User not authenticated" });
//     }
//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//             userModel.findById(decoded.user._id) // Replace with your actual user lookup logic
//             .then(user => {
//                 if (user) {
//                     return res.status(200).json({
//                         message: "User data retrieved successfully",
//                         data: user
//                     });
//                 } else {
//                     return res.status(404).json({ message: "User not found" });
//                 }
//             })
//             .catch(err => res.status(500).json({ message: "Server error", error: err }));
//     } catch (err) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// });

// module.exports = router;



// router.js
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../helpers/socialLogin'); // Import passport configuration
const router = express.Router();

// JWT Secret
const jwtSecret = process.env.SECRET;

// Generate JWT Token
function generateToken(user) {
  return jwt.sign({ user: { id: user._id, email: user.email, username: user.username } }, jwtSecret, { expiresIn: '1h' });
}

// Google Login Route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback Route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure', failureFlash: true }),
  (req, res) => {
    if (req.isAuthenticated() && req.user) {
      // Generate JWT Token
      const token = generateToken(req.user);

      // Redirect with token as a query parameter or send it back to the frontend
      return res.redirect(`https://spiraltech.onrender.com/#/auth-success?token=${token}`);
    } else {
      return res.redirect("/auth/google/failure");
    }
  }
);

// Route to Get User Data with Token Authentication
router.get('/auth/user', authenticateToken, (req, res) => {
  // User is authenticated, return user data
  res.status(200).json({
    message: "User data retrieved successfully",
    data: req.user, // The user data extracted from the token
  });
});

// Token Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Google Failure Route
router.get('/auth/google/failure', (req, res) => {
  res.send("Failed to authenticate using Google. Please try again.");
});

// A Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;