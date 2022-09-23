var express = require('express');
var indexRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Welcome';

indexRouter.get('/', function(req, res, next) {
  console.log(app.locals);
  res.render('index', {
     title: 'Family Favorites - Welcome' 
    });
});

indexRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.render('debug', {
    _username: username, 
  });
});


module.exports = indexRouter;
