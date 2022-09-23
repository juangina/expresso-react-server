/*
  module.exports.regUser = regUser;

  var reguser = require('./postgresUser');
  var userProfile = reguser.regUser;
  user = new userProfile();
  console.log(module);
  console.log(user);
*/

/*
  module.exports = {regUser: regUser};

  var reguser = require('./postgresUser');
  var userProfile = reguser.regUser;
  user = new userProfile();
  console.log(module);
  console.log(user);
*/

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const database = require('../config/database')
// JUAN!!!!! You are brilliant!!!!!  You created your own Database Object Model Class to interact with your postgres database!!!!!!
class regUser {
  
  constructor() {
    this.id = 0;
    this.username = "";
    this.email = "";
    this.password = "";
    //This is a flag to indicate a user is in the database
    this.user_status = false;
    //Loads uses from database
    this.get_users();
    this.users = []
  }

  get_users = async () => {
    // const pool = new Pool({
    //     user: "fxngyvob",
    //     host: "suleiman.db.elephantsql.com",
    //     database: "fxngyvob",
    //     password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
    //     port: 5432
    //   });
      const pool = new Pool(database);
    try {
        const sql_search = `SELECT * FROM users`;
        const results = await pool.query(sql_search) 
        //console.log(results.rows);
        this.users = results.rows;    
    } 
    catch (err) {
        console.log("Constructor SELECT * query error: ", err);
    }
  }

  get_user_by_id (id) {
    const pool = new Pool({
    user: "fxngyvob",
    host: "suleiman.db.elephantsql.com",
    database: "fxngyvob",
    password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
    port: 5432
    });

    const sql_search = `SELECT * FROM users WHERE id = $1`;
    const user_id = [id];
    pool.query(sql_search, user_id, (err, result) => {
        //console.log(result.rows[0]);
        if (err) {
          console.log("INSERT query error: ", err);
            console.log(err.message);
        }
        if(result.rowCount === 1) {
            console.log("User Found");

        }
        else {
            console.log('User Not Found');

        }
    });
    return true;
  }

  put_user (username, email, password) {

    const pool = new Pool({
      user: "fxngyvob",
      host: "suleiman.db.elephantsql.com",
      database: "fxngyvob",
      password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
      port: 5432
    });
    const sql_search = `SELECT * FROM users WHERE username = $1`;
    var user = [username];
    pool.query(sql_search, user, (err, result) => {
      //This is a flag to indicate a user is in the database
      this.user_status = false;
      //console.log(result.rowCount);
      if (err) {
        console.log("SELECT query error: ", err);
        return console.error(err.message);
      }
      if(result.rowCount === 1) {
        //console.log("User Found");
        this.user_status = true;
      }
      else {
        //console.log('User Not Found')
        this.user_status = false;
      }
      //console.log("user_status: ", user_status);
      if(this.user_status === true) {
        console.log("User already registered.  Please log in or select another username.")
        return "User already registered.  Please log in or select another username.";
      }
      else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
  
            if (err) {console.log('hash error.'); throw err;}
  
            password = hash;
            const sql_insert = `INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3);`;
            user = [username, email, password];
            pool.query(sql_insert, user, async (err, result) => {
              if (err) {
                console.log("INSERT query error: ", err);
                return console.error(err.message);
              } 
              console.log("User entered in Family Favorites Portal");
              return "User entered in Family Favorites Portal";
            });
          });
        });
      }
    }); 
  }

  //This function passes in values to the callback function
  //This function represents what is true about most provided
  //callback functions.  The callback function parameters are provided by
  //the authentication function while processing the data
  authenticate_user(username, password, fn) {
    if (!module.parent) {
      console.log('authenticating %s:%s', username, pass);
    }

    // const pool = new Pool({
    //   user: "fxngyvob",
    //   host: "suleiman.db.elephantsql.com",
    //   database: "fxngyvob",
    //   password: "xK1LgvxhElyW2xo1Xo_FqDmAfuspS6dI",
    //   port: 5432
    // });
    const pool = new Pool(database);
    const sql_search = `SELECT * FROM users WHERE username = $1`;
    const user_id = [username];
    pool.query(sql_search, user_id, (err, result) => {
        console.log(result.rows[0]);
        if (err) {
          console.log('DB Query error.\n');
            return fn(err, null);
        }
        if(result.rowCount === 1) {
            console.log("User Found, Authenticating Password");
            //Apply the same algorithm to the POSTed password, applying
            //the hash against the pass / salt, 
            //If there is a match we found the user
            //Regenerate equivalent password hash for exising password
            bcrypt.compare(password, result.rows[0]['password'], (err, isMatch) => {
              if (err) {
                console.log('hash error.\n');
                return fn(err, null); 
              }
              //The final password test//////////////////////////
              if (isMatch) {
                  //Create a new user object
                  const user = {}
                  //Load new user object with properties
                    user.id = result.rows[0]['id'];
                    user.username = result.rows[0]['username'];
                    user.email = result.rows[0]['email'];
                    user.password = result.rows[0]['password'];
                    console.log(user,"\n");
                  //Forward newly created user object to app session  
                  return fn(null, user)
              } else {
                console.log("Invalid Password.\n");
                return fn(new Error('invalid password'), null);
              }
            });
        }
        else {
            console.log('User Not Found.\n');
            return fn(new Error('cannot find user'), null);
        }
    });
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    /*
    hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
      if (err) 
        return fn(err, null);
      if (hash === user.hash) 
        return fn(null, user)
      fn(new Error('invalid password'));
    });
    */
  }  

}

module.exports = {regUser: regUser};  //Option One
//module.exports.regUser = regUser;   //Options Two

/*
  //This is an example of how to use the function for authenticating a
  //route request.  The callback function is left up to the programmer

  authenticate(req.body.username, req.body.password,

  //Callback Function that "We Write!!!"
  //This callback is either supplied a user or an error
  //by the authentication process - user exist and password match 

    function(err, user) {
      if (user) {
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');
      });
        } else {
          req.session.error = 'Authentication failed, please check your '
            + ' username and password.'
            + ' (use "tj" and "foobar")';
          res.redirect('/login');
        }
      }//end Callback Function

    );








  var user1 = new regUser();
  var myUser = user1.get_user('juaneric');
  console.log(myUser);


  Result {
    command: 'SELECT',
    rowCount: 1,
    oid: null,
    rows: [
      {
        id: 11,
        username: 'juaneric',
        email: 'ericrenee21@gmail.com',
        password: 'pbkdf2:sha256:150000$vGoHFUdv$fb20c2446c38b81b1941e68c74c0fcb92cc02150d2dbf0cac229cd97171b4f45'
      }
    ],
    fields: [
      Field {
        name: 'id',
        tableID: 764722,
        columnID: 1,
        dataTypeID: 23,
        dataTypeSize: 4,
        dataTypeModifier: -1,
        format: 'text'
      },
      Field {
        name: 'username',
        tableID: 764722,
        columnID: 2,
        dataTypeID: 25,
        dataTypeSize: -1,
        dataTypeModifier: -1,
        format: 'text'
      },
      Field {
        name: 'email',
        tableID: 764722,
        columnID: 3,
        dataTypeID: 25,
        dataTypeSize: -1,
        dataTypeModifier: -1,
        format: 'text'
      },
      Field {
        name: 'password',
        tableID: 764722,
        columnID: 4,
        dataTypeID: 25,
        dataTypeSize: -1,
        dataTypeModifier: -1,
        format: 'text'
      }
    ],
    _parsers: [
      [Function: parseInteger],
      [Function: noParse],
      [Function: noParse],
      [Function: noParse]
    ],
    _types: TypeOverrides {
      _types: {
        getTypeParser: [Function: getTypeParser],
        setTypeParser: [Function: setTypeParser],
        arrayParser: [Object],
        builtins: [Object]
      },
      text: {},
      binary: {}
    },
    RowCtor: null,
    rowAsArray: false
  }
*/