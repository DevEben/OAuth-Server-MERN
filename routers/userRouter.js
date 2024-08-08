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



// routers/userRouter.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { twitterClient } = require('../helpers/socialLogin');
const userModel = require('../models/userModel');
const router = express.Router();

const jwtSecret = process.env.SECRET; 

// Google Authentication Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/google/failure',
    session: false // No session persistence
}), (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, jwtSecret, { expiresIn: '1h' }); // Use only the ID for the token
    res.redirect(`https://spiraltech.onrender.com/#/auth-success?token=${token}`);
});


// // Sign-in with Twitter
// router.get('/auth/twitter', (req, res) => {
//     const authUrl = twitterClient.generateOAuth2AuthLink(
//       process.env.TWITTER_CALLBACK_URL,      
//        {
//         scope:  ['tweet.read', 'users.read'],
//     });
//     res.redirect(authUrl);
//   });
  
//   // Twitter Callback
//   router.get('/twitter/callback', async (req, res) => {
//     const { code } = req.query;
//     try {
//       const { accessToken, refreshToken, user } = await twitterClient.login(code);
//       console.log("Twitter UserInfo: ", user);
  
//       let existingUser = await userModel.findOne({ twitterId: user.id });
//       if (existingUser) {
//         existingUser.accessToken = accessToken;
//         existingUser.refreshToken = refreshToken;
//         await existingUser.save();
//       } else {
//         existingUser = new userModel({
//           twitterId: user.id,
//           name: user.name,
//           firstName: "",
//           lastName: "",
//           profilePicture: { url: "", public_id: Date.now() },
//           isVerified: true,
//           email: user.email,
//           accessToken,
//           refreshToken,
//         });
//         await existingUser.save();
//       }
  
//       req.session.user = existingUser; // Store user info in session
//       const token = jwt.sign({ userId: existingUser._id }, jwtSecret, { expiresIn: '1h' });
//       res.redirect(`https://spiraltech.onrender.com/#/auth-success?token=${token}`);
//     } catch (error) {
//       console.error("Error during Twitter callback:", error);
//       res.status(500).send("An error occurred during authentication.");
//     }
//   });


// Twitter Authentication Routes
router.get('/auth/twitter', passport.authenticate('twitter', {
    scope: ['tweet.read', 'users.read', 'email'],
  }));
  
  router.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/auth/twitter/failure',
    //   session: true,
  }), (req, res) => {
    try {
      const token = jwt.sign({ userId: req.user._id }, jwtSecret, { expiresIn: '1h' });
      console.log(token)
      res.redirect(`https://spiraltech.onrender.com/#/auth-success?token=${token}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred during authentication');
    };
  });
  



// Get User Data with Token Authentication
router.get('/auth/user', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId); // Use findById with userId
        if (user) {
            return res.status(200).json({
                message: "User data retrieved successfully",
                data: user
            });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
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
        req.user = decoded; // Set decoded token to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

// Google Failure Route
router.get('/auth/google/failure', (req, res) => {
    res.send("Failed to authenticate using Google. Please try again.");
});

// Twitter Failure Route
router.get('/auth/twitter/failure', (req, res) => {
    res.send("Failed to authenticate using Twitter. Please try again.");
});


// Logout Route
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: "Logout error", error: err });
        }
        req.session.destroy(); // Destroy session after logout
        res.redirect('/');
    });
});


module.exports = router;