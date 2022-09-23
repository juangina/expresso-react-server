// app.js
console.log('app.js');

/* Include customized .env Constants  */
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.resolve(__dirname, '.env')});

//Create the main application server
var express = require('express');
var app = express();
// Express JSON parser: 
app.use(express.json());
//Express request body parser: Extracts objects from data series
//During a get and post http requests
app.use(express.urlencoded({ extended: false }));

//Debug logger:  Outputs data related to the app session
var logger = require('morgan');
app.use(logger('dev'));

//Used to help connections between two different servers
const cors = require("cors");
app.use(cors());

//Express serial data parser:  Extract object from data series
//During a local file/file cache transfer
var cookieParser = require('cookie-parser');
app.use(cookieParser());

/* Set Security Configs */
const helmet = require('helmet');
app.use(helmet());
const hpp = require('hpp');
app.use(hpp());

//Express Session:  NEEDS RESEARCH!!!!!!
// var session = require('express-session');
// app.use(
//   session({
//     key: "userId",
//     secret: 'shhhh, very secret',
//     resave: false, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
//     cookie: {
//       expires: 60 * 60 * 24,
//       sameSite: "none",
//       httpOnly: true
//     }
//   })
// );

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

//Session-persisted message middleware for the {% message %} tag in ejs
//Capture the message from a previous endpoint for
//display in the next endpoint res.send() or res.redirect()
app.use(function(req, res, next){
  //Save the messages
  var err = req.session.error;
  var msg = req.session.success;
  //Clear the old message que
  delete req.session.error;
  delete req.session.success;
  //Clear the current message bay
  res.locals.message = '';
  //Update with new messages
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  // console.log("completing message transfer");
  next();
});

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  //console.log('res.locals.user:', res.locals.user);
  next();
})

//Passport Config
const passport = require('./middlewares/passport');
app.use(passport.initialize());
// app.use(passport.session());


const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

//This is a public route for non-authenitcated request objects
var {indexRouter, registrationRouter, loginRouter, contactRouter} = require('./routes/_public');
//This is a private route for authenticated request objects
var {dashboardRouter, triviaRouter, productsRouter, debugRouter, logoutRouter} = require('./routes/_private');
//These are the public route paths for non-authenticated request objects
// app.use('/', indexRouter);
// app.use('/registration', registrationRouter);
// app.use('/login', loginRouter);
// app.use('/contact', contactRouter);

//These are the private route paths for authenticated request objects
// app.use('/dashboard', dashboardRouter);
// app.use('/trivia', triviaRouter);
// app.use('/products', productsRouter);
// app.use('/logout', logoutRouter);
// app.use('/debug', debugRouter);

// catch 404 and forward to error handler
// var createError = require('http-errors');
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// This conditional is here for testing purposes:
// if (!module.parent) { 
//   // Add your code to start the server listening at PORT below:
//   app.listen(5000, () => {
//     console.log(`Server is listening on ${5000}`);
//   });
// }

//Make the app module/object key: value pair be available for other files/modules
module.exports = app;

