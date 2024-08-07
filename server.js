require('./dbConfig/dbConfig');
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

require("./helpers/socialLogin"); // Make sure this points to the correct file

const routes = require("./routers/userRouter");

const app = express();

// CORS Configuration
const corsOptions = {
    origin: [
        "https://spiraltech.onrender.com",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true // Allow credentials (cookies)
};

app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Set to false to prevent uninitialized sessions from being saved
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    cookie: { 
        secure: true, // Secure cookies in production
        httpOnly: true, // Prevents client-side JS from reading the cookie
    },
}));

// Initialize Passport and manage sessions
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use("/", routes);

// Server listener
const PORT = process.env.PORT || 3000; // Use a default port if not set in the environment
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
