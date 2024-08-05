require('./dbConfig/dbConfig');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('./helpers/socialLogin');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const socialRouter = require('./routers/userRouter');
const app = express();
const port = process.env.PORT || 5000; // Default to port 5000 if not specified

// MongoDB connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN, // Set the client origin dynamically from environment variables
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true // Allow credentials (cookies) to be sent
};

// Middleware for CORS
app.use(cors(corsOptions));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Initialize passport and use passport session
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  return res.send("Welcome to Asian Pacific Express API!");
});

// Define routes
app.use('/', socialRouter);

// Add error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parsing error
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  res.status(500).json({ message: 'Internal Server Error: ' + err });
  next();
});

// Start the server
app.listen(port, () => {
  console.log('Server up and running on port: ' + port);
});
