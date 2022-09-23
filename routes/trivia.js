var express = require('express');
var triviaRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Trivia Game';

triviaRouter.get('/', function(req, res, next) {
  res.render('trivia', { title: 'Family Favorites - Trivia Game' });
});

triviaRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.render('debug', {
    _username: username, 
  });
});


module.exports = triviaRouter;