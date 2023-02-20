// app.js
console.log('loading app.js');

/* Include customized .env Constants  */
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.resolve(__dirname, '.env')});

//Create the main application server
var express = require('express');
var app = express();

//Tell express where to serve static files
app.use(express.static(path.join(__dirname, 'expresso_react_client')));

//Debug logger:  Outputs data related to the app session
var logger = require('morgan');
app.use(logger('dev'));

/* Set Security Configs */
const helmet = require('helmet');
app.use(helmet());
const hpp = require('hpp');
app.use(hpp());

//Cookie Session:  NEEDS RESEARCH!!!!!!
var session = require('cookie-session');
app.use(
  session({
    name: 'session',
    secret: process.env.COOKIE_SECRET, // WE USE THIS NOW :)
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  })
);

const csurf = require('csurf');
app.use(csurf());

/* Rate Limiter */
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

//Passport Config
const passport = require('./middlewares/passport');
app.use(passport.initialize());

//If the request is for a static file, then serve React Application
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'expresso_react_client', 'index.html'));
})

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

//Make the app module/object key: value pair be available for other files/modules
module.exports = app;
console.log('finish loading app.js');

