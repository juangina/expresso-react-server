// auth.js
console.log('auth.js');

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

//AuthO authorization
//This is more like registration and login credentials database.
router.get('/login', 
    (req, res, next) => {
        console.log('router.get.login01');
        next();
        
    },
    passport.authenticate('auth0', {
        scope: 'openid email profile',
    }),
    (req, res) => {
        console.log('router.get.login03');
        res.redirect('https://expresso.theaccidentallifestyle.net');
    }
);

router.get('/callback', 
    (req, res, next) => {  
        passport.authenticate('auth0', (err, user) => {
            console.log("User Object fromm Auth0:", user);
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login');
            }
            const userReturnObject = {
                nickname: user.nickname,
                picture: "https://mdc.theaccidentallifestyle.net/images/portfolioLogo04.png",
            };
            req.session.jwt = jwt.sign(userReturnObject, process.env.JWT_SECRET_KEY);
            console.log('/callback req.session.jwt:', req.session.jwt);
            res.redirect('https://expresso.theaccidentallifestyle.net');
        })(req, res, next);
        //In this example, passport.authenticate is returning a route function, hence the (req, res);
    
    }
);
//This is what passport normally does.  It redirects to Auth0 when called
router.get('/logout', 
    (req, res) => {
        console.log('/logout req.session.jwt:', req.session.jwt);
        req.session = null;
        const homeURL = encodeURIComponent('https://expresso.theaccidentallifestyle.net/');
        res.redirect(
            `https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${homeURL}&client_id=${process.env.AUTH0_CLIENT_ID}`
        );
    }
);

//JWT Authorization
const jwtRequired = passport.authenticate('jwt', { session: false });

router.get('/private-route', 
    jwtRequired, 
    (req, res) => {
        console.log('/private-route req.session.jwt:', req.session.jwt);
        return res.json({message: 'This is private data from a private route'});
    }
);

router.get('/current-session', (req, res) => {
        console.log('/current-session req.session.jwt:', req.session.jwt);
        console.log("authenticating user");
        passport.authenticate('jwt', { session: false }, (err, user) => {
                console.log('/current-session user:', user);
                if (err || !user) {
                    res.send(false);
                } else {
                    res.send(user);
                }
            }
        )(req, res);
        //If you have a function that returns a function, you chain call that function directly.
        //In this example, passport.authenticate is returning a route function, hence the (req, res);
    }
);

module.exports = router;