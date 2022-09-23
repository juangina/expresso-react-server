var express = require('express');
var debugRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Debug Page';

debugRouter.get('/', function(req, res, next) {
  res.render('debug', { title: 'Family Favorites - Debug Page' });
});

debugRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.render('debug', {
    _username: username, 
  });
});


module.exports = debugRouter;