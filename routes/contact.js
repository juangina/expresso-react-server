var express = require('express');
var contactRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Contact Me';

contactRouter.get('/', function(req, res, next) {
  res.render('contact', { title: 'Family Favorites - Contact Me' });
});

contactRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.render('debug', {
    _username: username, 
  });
});


module.exports = contactRouter;