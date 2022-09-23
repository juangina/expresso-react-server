var express = require('express');
var dashboardRouter = express.Router();

//var app = require('../app');
app = express();
app.locals.title = 'Family Favorites - Dashboard';

dashboardRouter.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Family Favorites - Dashboard' });
});

dashboardRouter.post('/', function(req, res, next) {
  username = req.body.username;
  console.log(app.locals);
  res.render('debug', {
    _username: username, 
  });
});


module.exports = dashboardRouter;





