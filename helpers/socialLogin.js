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



// // Twitter OAuth2 Strategy
// passport.use(new TwitterStrategy({
//         clientID: process.env.TWITTER_CLIENT_ID,
//         clientSecret: process.env.TWITTER_CLIENT_SECRET,
//         clientType: 'confidential',
//         callbackURL: process.env.TWITTER_CALLBACK_URL,
//         scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         console.log('Success!', { accessToken, refreshToken });
//         try {
//             console.log("Twitter User Profile: ", profile); // Log the profile for debugging
//             const twitterId = profile.id;
//             const email = profile.emails ? profile.emails[0].value : null; // Handle missing email

//             const existingUser = await userModel.findOne({
//                 $or: [{ email: email }, { twitterId: twitterId }]
//             });

//             if (existingUser) {
//                 return done(null, existingUser); // Existing user found
//             }

//             // Create a new user
//             const newUser = new userModel({
//                 twitterId: twitterId,
//                 email: email,
//                 firstName: profile.displayName.split(' ')[0],
//                 lastName: profile.displayName.split(' ')[1] || '',
//                 profilePicture: { url: profile.photos[0].value, public_id: Date.now() },
//                 isVerified: true, // Assume email is verified if using Twitter
//             });

//             await newUser.save(); // Save the new user
//           return done(null, user);
//         } catch (err) {
//           return done(err);
//         }
//       }
//     )
//   );


// const twitterClient = new TwitterApi({
//     appKey: process.env.TWITTER_CLIENT_ID,
//     appSecret: process.env.TWITTER_CLIENT_SECRET,
//     accessToken: process.env.TWITTER_ACCESS_TOKEN,
//     accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//   });



//   module.exports = { twitterClient };

// const tokenStore = new OAuthTokenStore();





// helpers/socialLogin.js
// const { TwitterApi } = require('twitter-api-v2');
// const TwitterApi = require('twitter-api-v2').default;
// const { Strategy: TwitterStrategy } = require('@superfaceai/passport-twitter-oauth2');
// const TwitterOAuth2Strategy = require('passport-twitter-oauth2');
// const OAuthTokenStore = require('oauth-token-store').default;

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



// // Set up the Twitter OAuth 2.0 strategy
// passport.use(new TwitterStrategy({
//   clientID: process.env.TWITTER_CLIENT_ID, // OAuth 2.0 Client ID
//   clientSecret: process.env.TWITTER_CLIENT_SECRET, // OAuth 2.0 Client Secret
//   clientType: 'confidential',
//   callbackURL: "https://spiraltech-api.onrender.com/auth/twitter/callback",
//   scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'], // Define scopes as needed
//   state: true, // Enable state parameter for additional security
//   // pkce: true, // Enable PKCE for enhanced security (if supported by library)
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     console.log("Twitter User Profile: ", profile); // Log the profile for debugging
//     const twitterId = profile.id;
//     const email = profile.emails ? profile.emails[0].value : null; // Handle missing email

//     // Check if the user exists
//     const existingUser = await userModel.findOne({
//       $or: [{ email: email }, { twitterId: twitterId }]
//     });

//     if (existingUser) {
//       return done(null, existingUser); // Existing user found
//     }

//     // Create a new user
//     const [firstName, ...lastNameParts] = profile.displayName.split(' ');
//     const lastName = lastNameParts.join(' ');

//     const newUser = new userModel({
//       twitterId: twitterId,
//       email: email,
//       firstName: firstName,
//       lastName: lastName || '',
//       profilePicture: {
//         url: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null, 
//         public_id: Date.now().toString() // Ensure public_id is a string
//       },
//       isVerified: true // Assume email is verified if using Twitter
//     });

//     await newUser.save(); // Save the new user
//     return done(null, newUser); // Return new user
//   } catch (err) {
//     console.error("Error in Twitter OAuth 2.0 strategy:", err);
//     return done(err);
//   }
// }));


//   //Added logging to capture more information about the flow
//   passport.use(new TwitterStrategy({
//     clientID: process.env.TWITTER_CLIENT_ID,
//     clientSecret: process.env.TWITTER_CLIENT_SECRET,
//     callbackURL: "https://spiraltech-api.onrender.com/auth/twitter/callback",
//     scope: ['tweet.read', 'users.read', 'offline.access'],
//     state: true
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       console.log("Access Token: ", accessToken);
//       console.log("Refresh Token: ", refreshToken);
//       console.log("Profile: ", profile);

//       // Your logic here...

//     } catch (err) {
//       console.error("Error during authentication: ", err);
//       return done(err);
//     }
//   }));


// Set up Twitter strategy

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  includeEmail: true,
},
  async (token, tokenSecret, profile, done) => {
    try {
      console.log("Profile: " + profile);
      // Twitter does not always provide an email, so handle this case
      const email = profile.emails[0].value;

      let user = await userModel.findOne({ email });

      if (!user) {
        user = await userModel.create({
          firstName: profile.displayName.split(' ')[0] || '',
          lastName: profile.displayName.split(' ')[1] || '',
          email: email || '',
          profilePicture: {
            url: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
            public_id: Date.now().toString() // Ensure public_id is a string
          },
          isVerified: true // Assume email is verified if using Twitter
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));



module.exports = passport;
