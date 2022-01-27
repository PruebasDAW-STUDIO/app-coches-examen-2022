var express = require('express');
var router = express.Router();
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../lib/protect');


router.get('/', function(req, res, next) {
  res.send("ATUTENTICATION MAIN!!!");
});

router.get('/signin', isNotLoggedIn, function(req, res, next) {
  res.render('auth/signin');
  //res.send("AUTHENTICATION!!!");
  
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.signin', {
    successRedirect: '/authentication/profile',
    failureRedirect: '/authentication/signin',
    failureFlash: true
  })(req, res, next);
});



/* GET home page. */
router.get('/signup', isNotLoggedIn, function(req, res, next) {
  res.render('auth/signup');
  //res.send("AUTHENTICATION!!!");
  
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  successRedirect: '/authentication/profile',
  failureRedirect: '/authentication/signup',
  failureFlash: true
}));

router.get('/profile', isLoggedIn, (req, res)=>{
  //res.send('PROFILE');
  res.render('profile');
});

router.get('/logout', isLoggedIn, (req, res)=>{
  req.logOut();
  res.redirect('/authentication/signin');
});

module.exports = router;