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
// router.get('/auth/twitter', (req, res, next) => {
//     req.session.state = Math.random().toString(36).substr(2, 9); // Generate a random state
//     passport.authenticate('twitter', {
//         state: req.session.state,
//     })(req, res, next);
// });

// // Get the OAuth tokens from the query parameters
// const oauthToken = req.query.oauth_token;
// const oauthVerifier = req.query.oauth_verifier;

// // Store the OAuth tokens in the sessions collection
// req.session.oauthToken = oauthToken;
// req.session.oauthVerifier = oauthVerifier;


// router.get('/auth/twitter', passport.authenticate('twitter', {
//     scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
//   }));

// router.get('/auth/twitter/callback', passport.authenticate('twitter', {
//     failureRedirect: '/auth/twitter/failure',
//     session: true
// }), (req, res) => {
//     try {
//         const token = jwt.sign({ userId: req.user._id }, jwtSecret, { expiresIn: '1h' });
//         console.log(token)
//         res.redirect(`https://spiraltech.onrender.com/#/auth-success?token=${token}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error occurred during authentication');
//     };
// });



// routers/userRouter.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// const { twitterClient } = require('../helpers/socialLogin');
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

// Google Failure Route
router.get('/auth/google/failure', (req, res) => {
    res.send("Failed to authenticate using Google. Please try again.");
});





// // Route to initiate Twitter login
// router.get('/auth/twitter',
//     passport.authenticate('twitter', { session: true }) // Use session as needed
// );


// // Callback route to handle Twitter's response
// router.get('/auth/twitter/callback',
//     passport.authenticate('twitter', { failureRedirect: '/auth/twitter/failure', session: true }),
//     async (req, res) => {
//         // Check if there is an authentication error
//         if (req.query.error) {
//             console.error('Twitter authentication error:', req.query.error);
//         }

//         // Retrieve authorization code from query parameters
//         const code = req.query.code;

//         console.log('Twitter authorization code: ', code);

//         // Exchange the authorization code for an access token
//         const tokenResponse = await exchangeCodeForToken(code);
//         const accessToken = tokenResponse.access_token;

//         // Set authorization header with access token
//         req.headers.authorization = `Bearer ${accessToken}`;


//         // Successful authentication
//         const token = jwt.sign({ userId: req.user._id }, jwtSecret, { expiresIn: '1h' });
//         return res.redirect(`https://spiraltech.onrender.com/#/auth-success?token=${token}`);
//     }
// );


router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/auth/twitter/success',
    failureRedirect: '/auth/twitter/failure'
}));

router.get('/auth/twitter/success', (req, res) => {
    if (req.user) {
        const username = req.user.twitterId;
        req.session.user = { username };

        console.log("User: " + req.user);

        // Successful authentication
        const token = jwt.sign({ userId: req.user._id }, jwtSecret, { expiresIn: '1h' });
        return res.redirect(`https://spiraltech.onrender.com/#/auth-success?token=${token}`);
    } else {
        return res.redirect('/auth/twitter/failure');
    }
});

router.get('/auth/twitter/failure', (req, res) => {
    return res.status(401).json('Authentication failed');
});



// // Function to exchange the authorization code for an access token
// async function exchangeCodeForToken(code) {
//     const clientIdAndSecret = `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_SECRET_KEY}`;
//     const encodedClientIdAndSecret = Buffer.from(clientIdAndSecret).toString('base64');

//     const requestOptions = {
//       method: 'POST',
//       url: 'https://api.x.com/2/oauth2/token',
//       headers: {
//         'Authorization': `Basic ${encodedClientIdAndSecret}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       data: new URLSearchParams({
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: process.env.TWITTER_CALLBACK_URL,
//         code_verifier: req.session.codeVerifier, // Ensure you have stored this during the auth flow
//       }),
//     };

//     const response = await axios(requestOptions);
//     return response.data;
//   }



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