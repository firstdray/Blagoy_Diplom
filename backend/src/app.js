const express = require('express');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const app = express();
const cors = require('cors');
const path = require("path");
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({path: envPath});
const port = process.env.PORT;
const pgDb = require('../src/db/pg');

const companyRoutes = require('../src/routes/company');
const adminRoutes = require('../src/routes/admin');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(session({
    store: new pgSession({
       pool: pgDb,
       tableName: 'session',
       createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))
app.use(companyRoutes);
app.use(adminRoutes);

app.listen(port, ()=> console.log(`Server running on port ${port}`));