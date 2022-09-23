var express = require('express');
var loginRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Login';

loginRouter.get('/', function(req, res, next) {
  res.render('login', { title: 'Family Favorites - Login' });
});

loginRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.render('debug', {
    _username: username, 
  });
});


module.exports = loginRouter;





