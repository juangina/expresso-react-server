var express = require('express');
var productsRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Products';

productsRouter.get('/', function(req, res, next) {
  res.render('products', { title: 'Family Favorites - Family Products' });
});

productsRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.render('debug', {
    _username: username, 
  });
});


module.exports = productsRouter;