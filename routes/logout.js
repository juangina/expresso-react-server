var express = require('express');
var logoutRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Logout';

logoutRouter.get('/', function(req, res, next) {
  app.locals.title = 'Family Favorites - Logout';
  res.redirect('/');
});

logoutRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.redirect('/');
});


module.exports = logoutRouter;