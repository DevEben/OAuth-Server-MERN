// server.js
require('./dbConfig/dbConfig');
const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

require("./helpers/socialLogin");

const routes = require("./routers/userRouter");

const app = express();

const corsOptions = {
    origin: [
        "https://courier-management.onrender.com",
        "https://spiraltech.onrender.com",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5500/googleAuth.html"
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 60000,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
