require('./dbConfig/dbConfig');
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
// const MongoStore = require("connect-mongo");
const sessionStore = require('./helpers/sessionStore');
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

// MongoDB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration using MongoStore
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore,
//     cookie: {
//         secure: true, // Enable secure cookies in production
//         maxAge: 1000 * 60 * 60 * 24, // 1 day
//     },
// }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport and manage sessions
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send(`<h3>Welcome to Spiral Tech Test Api</h3>`);
});

// Use routes
app.use("/", routes);

// Server listener
const PORT = process.env.PORT || 3000; // Use a default port if not set in the environment
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});