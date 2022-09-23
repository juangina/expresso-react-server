var express = require('express');
const { Pool } = require("pg");
const bcrypt = require('bcryptjs');
var session = require('express-session');
var nodemailer = require('nodemailer')

var reguser = require('../models/User');
var userProfile = reguser.regUser;

var indexRouter = express.Router();
var contactRouter = express.Router();
var registrationRouter = express.Router();
var loginRouter = express.Router();

const database = require('../config/database')

//var app = require('../app');
app = express();

const authenticate_user = async (username, password, fn) => {
  if (!module.parent) {
    console.log('authenticating %s:%s', username, password);
  }

  // const pool = new Pool({
  //   user: "fxngyvob",
  //   host: "suleiman.db.elephantsql.com",
  //   database: "fxngyvob",
  //   password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
  //   port: 5432
  // });

  const pool = new Pool(database);

  const sql_search = `SELECT * FROM users WHERE username = $1`;
  const user_id = [username];
  var result = await pool.query(sql_search, user_id)
      //console.log(result.rows[0]);
      if(result.rowCount === 1) {
          console.log("User Found, Authenticating Password");
          //Apply the same algorithm to the POSTed password, applying
          //the hash against the pass / salt, 
          //If there is a match we found the user
          //Regenerate equivalent password hash for exising password
          bcrypt.compare(password, result.rows[0]['password'], (err, isMatch) => {
            if (err) {
              console.log('hash error.\n');
              return fn(err, null); 
            }
            //The final password test//////////////////////////
            if (isMatch) {
                //Create a new user object
                const user = {}
                //Load new user object with properties
                  user.id = result.rows[0]['id'];
                  user.username = result.rows[0]['username'];
                  user.email = result.rows[0]['email'];
                  user.password = result.rows[0]['password'];
                  //console.log(user,"\n");
                //Forward newly created user object to app session  
                return fn(null, user)
            } else {
              console.log("Invalid Password.\n");
              return fn(new Error('invalid password'), null);
            }
          });
      }
      else {
          console.log('User Not Found.\n');
          return fn(new Error('cannot find user'), null);
      }
} 

//Index Router//////////////////////////////////////////////////////////
indexRouter.get('/', function(req, res, next) {
  console.log(req.body);  
  res.json({user_status: "indexRouter.get"});
});

indexRouter.post('/', function(req, res, next) {  
  console.log(req.body);
  res.json({user_status: "indexRouter.post"});
});
//Contact Router//////////////////////////////////////////////////////////
contactRouter.get('/', function(req, res, next) {
  console.log(req.body);
  res.json({user_status: "contactRouter.get"});
});

contactRouter.post('/', function(req, res, next) {
  app.locals.title = 'Family Favorites - Contact Me'; 
  username = req.body.username;
  email = req.body.useremail;
  phone = req.body.phone;
  comments = req.body.comments;

  var transporter = nodemailer.createTransport({
    host: '',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: ''
    }
  });
  
  var mailOptions = {
    from: '<jejlifestyle@theaccidentallifestyle.net>',
    to: 'ericrenee21@gmail.com',
    subject: 'Family Favorites - Contact Me',
    text: comments
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.json({mail_status: false});
    } else {
      console.log('Email sent: ' + info.response);
      res.json({mail_status: true});
    }
  });

});
//Registration Router//////////////////////////////////////////////////////
registrationRouter.get('/', function(req, res, next) {
  console.log(req.body);
  res.json({user_registration_status: "registrationRouter.get"});
});

registrationRouter.post('/', async function(req, res, next) {
  // const pool = new Pool({
  //   user: "fxngyvob",
  //   host: "suleiman.db.elephantsql.com",
  //   database: "fxngyvob",
  //   password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
  //   port: 5432
  // });

  const pool = new Pool(database);

  try {
    let username = req.body.username;
    let useremail = req.body.useremail;
    let password1 = req.body.password1;
    var user_registration_status = false;

    const sql_search = `SELECT * FROM users WHERE username = $1`;
    var user = [username];
    var result = await pool.query(sql_search, user);

    if(result.rowCount === 1) {
      //console.log("User Found");
      user_registration_status = true;
    }
    else {
      //console.log('User Not Found')
      user_registration_status = false;
    }

    //console.log("useer_registration_status: ", useer_registration_status);
    if(user_registration_status === true) {
      //console.log("User already registered.  Please log in or select another username.")
      res.json({user_registration_status: 'previously registered'});
    }
    else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password1, salt, (err, hash) => {

          if (err) {console.log('hash error.'); throw err;}

          password1 = hash;
          const sql_insert = `INSERT INTO users (username, email, password) 
          VALUES ($1, $2, $3);`;
          user = [username, useremail, password1];
          result = pool.query(sql_insert, user) 
          //console.log("User entered in Family Favorites Portal");
          res.json({user_registration_status: 'currently registered'});
          });
      });
    }

  }
  catch (err) {
    console.error(err.message);
  }

});

//Login Router//////////////////////////////////////////////////////////
loginRouter.get('/', function(req, res, next) {
  console.log('req.session:', req.session);
  res.json({loginRouter_get: "loginRouter.get"});
});

loginRouter.post('/', async function(req, res, next){
  authenticate_user(req.body.username, req.body.password,
    //Callback Function that "We Write"
    //This callback is either supplied a user or an error
    //by the authentication process - user exist and password match 
    function(err, user) {
      console.log("User Object Passed to app.post: ", user);
      if (user) {
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function(){
          // Store the user's primary key
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
          req.session.success = 'Authenticated as ' + user.username
            + ' click to <a href="/logout">logout</a>. '
            + ' You may now access <a href="/dashboard">/restricted</a>.';
        });
        res.json({user_login_status: "logged in"});
      } else {
        req.session.error = 'Authentication failed, please check your '
          + ' username and password.';
        res.json({user_login_status: " not logged in"});
      }
    }//end Callback Function
  );
});

module.exports.indexRouter = indexRouter;
module.exports.contactRouter = contactRouter;
module.exports.registrationRouter = registrationRouter;
module.exports.loginRouter = loginRouter;