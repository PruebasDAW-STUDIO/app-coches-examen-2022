var express = require('express');
var router = express.Router();
const passport = require('passport');
const helpers = require('../lib/helpers');


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

router.get('/passrecovery', (req, res) => {
  res.render('auth/passrecovery');
});

router.post('/passrecovery', async (req, res) => {

  console.log(req.body.username);
  
  var existe = await helpers.existeUsuario(req.body.username);
  console.log(existe);

  if(existe){
    req.flash('correcto', 'Se ha enviado un email a su correo');
    res.redirect('/authentication/signin');
  }else{
    req.flash('message', 'El usuario no existe');
    res.redirect('/authentication/signup')

  }
    
});

module.exports = router;