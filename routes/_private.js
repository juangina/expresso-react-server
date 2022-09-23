var express = require('express');
const { Pool } = require("pg");

var dashboardRouter = express.Router();
var triviaRouter = express.Router();
var productsRouter = express.Router();
var debugRouter = express.Router();
var logoutRouter = express.Router();

app = express();

//Add this function as middleware for your restricted routes
function restrict(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
    }
  }

dashboardRouter.get('/', restrict, async function(req, res, next) {
  const pool = new Pool({
    user: "",
    host: "",
    database: "",
    password: "",
    port: 5432
  });
  try {
    var dashboard_data = {}

    var sql_search = `SELECT * FROM "public"."favorite_topics" LIMIT 100`;
    var result = await pool.query(sql_search);
  
    if(result.rowCount) {
      console.log("Quotes Found");
      dashboard_data['topics_list'] = result.rows;
    }
    else {
      console.log('Quotes Not Found')
      dashboard_data['topics_list'] = '';
    }

    sql_search = `SELECT * FROM "public"."favorites" LIMIT 100`;
    result = await pool.query(sql_search);

    if(result.rowCount) {
      console.log("Favorites Found");
      dashboard_data['favorites_list'] = result.rows;
      res.status(200).json(dashboard_data);
    }
    else {
      console.log('Favorites Not Found')
      dashboard_data['favorites_list'] = '';
      res.status(400).json(dashboard_data);
    }
  }
  catch (err) {
    console.error(err.message);
  }
});

dashboardRouter.post('/', restrict, function(req, res, next) {
  //console.log(req.body)
  const pool = new Pool({
    user: "",
    host: "",
    database: "",
    password: "",
    port: 5432
  });

  try {
    let username = req.body.username;
    let topic = req.body.topic;
    let favorite = req.body.favorite;
    let comments = req.body.comments

    const sql_insert = `INSERT INTO favorites (username, topic, favorite, comments) 
    VALUES ($1, $2, $3, $4);`;
    let values = [username, topic, favorite, comments];
    let result = pool.query(sql_insert, values)
    result.then(result => {console.log(result);});
    res.json({favorite_status: true});

  }
  catch (err) {
    console.error(err.message);
    res.json({favorite_status: false});
  }
});

triviaRouter.get('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
  /*  
  app.locals.title = 'Family Favorites - Trivia Game';
    res.render('trivia', { title: 'Family Favorites - Trivia Game' });
  */
  });

triviaRouter.post('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
    /*
    app.locals.title = 'Family Favorites - Trivia Game';
    username = req.body.username;
    console.log(app.locals);
    res.render('debug', {
        _username: username, 
    });
    */
});

productsRouter.get('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
    /*
    app.locals.title = 'Family Favorites - Products';
    res.render('products', { title: 'Family Favorites - Family Products' });
    */
});

productsRouter.post('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
    /*
    app.locals.title = 'Family Favorites - Products';    
    username = req.body.username;
    console.log(app.locals);
    res.render('debug', {
        _username: username, 
    });
    */
});

debugRouter.get('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
    /*
    app.locals.title = 'Family Favorites - Debug Page';
    res.render('debug', { title: 'Family Favorites - Debug Page' });
    */  
});

debugRouter.post('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
    /*
    app.locals.title = 'Family Favorites - Debug Page';
    username = req.body.username;
    console.log(app.locals);
    res.render('debug', {
        _username: username, 
    });
    */
});

logoutRouter.get('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
    /*
    app.locals.title = 'Family Favorites - Logout';
    req.session.destroy(function(){
        res.redirect('/');
    });
    */
  });
  
logoutRouter.post('/', restrict, function(req, res, next) {
  console.log(req); console.log(res);
    /*
    app.locals.title = 'Family Favorites - Logout';
    username = req.body.username;
    console.log(app.locals);
    req.session.destroy(function(){
        res.redirect('/');
    });
    */
});
  
  
module.exports.logoutRouter = logoutRouter;
module.exports.triviaRouter = triviaRouter;
module.exports.dashboardRouter = dashboardRouter;
module.exports.productsRouter = productsRouter;
module.exports.debugRouter = debugRouter;