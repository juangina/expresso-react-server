const LocalStrategy = require('passport-local').Strategy;
var reguser = require('../models/User');
const bcrypt = require('bcryptjs');

//Since User Model is a class, it is "recreated" from the import Object
var userProfile = reguser.regUser;
//Once it has been recreated, an instance of this class is generated
//var User = new userProfile();

//module.exports is called by require() I think.
// module.exports = function(passport) {
function passport(passport) {
    ////////////////////////////////////////
    passport.use(
        new LocalStrategy(
            {   
                //Object: Optional names can be used for the post username and password fields in your form
                usernameField: 'username',
                passwordField: 'password'
            }, 
            //Callback Function: With supplied username and password from request parameters.
            //This is the callback verification that the programmer will customize.
            //This callback has three verifications:  Username exists, Password match, Database call error.  The Database call error is handled in the class.
            (username, password, done) => {
                //console.log(username, password);
                //Once it has been recreated, an instance of this class is generated
                var User = new userProfile();
                //This is the Username exists check
                var myUser = User.get_user(username);
                console.log(myUser);
                if(myUser.id === 0) {
                    console.log('That user is not registered');
                    return done(null, false, { message: 'That user is not registered' });
                }    
                //This is the Password match check
                bcrypt.compare(password, myUser.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        //myUser object will be saved om the request.user object
                        console.log('There is a match.  User Authenticated');
                        return done(null, myUser);
                    } else {
                        console.log('Password incorrect');
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            }
        )
    );
    ////////////////////////////////////////////
    passport.serializeUser(
        function(user, done) {
            console.log(user);
            done(null, user.id);
        }
    );
    //////////////////////////////////////////////
    passport.deserializeUser(function(id, done) {
        console.log(id);
        //This is the UserId exists check
        myUser = User.get_user_by_id(id)
        console.log(myUser);
        if(myUser.id === 0) {
            return done(err);
        }
        else {
            done(err, myUser)
        }
    });
    //////////////////////////////////////////////
};
