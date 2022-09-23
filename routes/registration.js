var express = require('express');
//var path = require('path');
const { Pool } = require("pg");

var registrationRouter = express.Router();

app = express();
app.locals.title = 'Family Favorites - Registration';

registrationRouter.get('/', function(req, res, next) {
  app.locals.title = 'Family Favorites - Registration';
  console.log(app.locals);
  res.render('registration', {
     title: 'Family Favorites - Registration' 
    });
});

registrationRouter.post('/', function(req, res, next) {
  app.locals.title = 'Family Favorites - Registration';
  console.log(app.locals);
  username = req.body.name;
  email = req.body.email;
  password1 = req.body.password1;
  password2 = req.body.password2;
  console.log(app.locals);

  const pool = new Pool({
    user: "fxngyvob",
    host: "suleiman.db.elephantsql.com",
    database: "fxngyvob",
    password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
    port: 5432
  });

  console.log("Connect to remote database complete");

  const sql_insert = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3);`;
  const user = [username, email, password1];
  pool.query(sql_insert, user, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
      console.log("New User Registered in Family Favorites Portal");
    });

  res.render('login', {
    title: 'Family Favorites - Registration'
    //_username: username, 
  });
});


module.exports = registrationRouter;





