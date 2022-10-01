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
        //console.log('router.get.login01');
        next();
        
    },
    passport.authenticate('auth0', {
        scope: 'openid email profile',
    }),
    (req, res) => {
        //console.log('router.get.login03');
        res.redirect('/');
    }
);

router.get('/callback', 
    (req, res, next) => {
        passport.authenticate('auth0', (err, user) => {
            //console.log("User Object fromm Auth0:", user);
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
            return res.redirect('/');
        })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.session = null;
    const homeURL = encodeURIComponent('https://expresso.theaccidentallifestyle.net/');
    res.redirect(
        `https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${homeURL}&client_id=${process.env.AUTH0_CLIENT_ID}`
    );
});

//JWT Authorization
const jwtRequired = passport.authenticate('jwt', { session: false });

router.get('/private-route', jwtRequired, (req, res) => {
    return res.json({message: 'This is private data from a private route'});
});

router.get('/current-session', (req, res) => {
    //console.log("authenticating user");
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            res.send(false);
        } else {
            res.send(user);
        }
    })(req, res);
});

module.exports = router;