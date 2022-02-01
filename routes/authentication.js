var express = require('express');
var router = express.Router();
const passport = require('passport');
const helpers = require('../lib/helpers');
const jwt = require('jsonwebtoken');


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
  
  var {existe, result } = await helpers.existeUsuario(req.body.username);
  user = result[0];
  console.log(existe);
  console.log("PATATA",user);
  if(existe){

    //TENEMOS QUE GENERAR EL TOKEN Y ENVIAR EL EMAIL CON LA RUTA CON ID Y EL TOKEN

    const user_id = user.id;
    const token = jwt.sign({      
      data: 'reset_password',
      user_id: user.id,
    }, 'secret', { expiresIn: 1*60 });
    console.log('TOKENIZATE', token);
    console.log('RUTA:', `localhost:3000/authentication/resetpass/${user.id}/${token}`);
    const resetlink = `http://localhost:3000/authentication/resetpass/${user.id}/${token}`;

    console.log(resetlink);
    helpers.sendEmailReset(user.username, user.email, resetlink);




    req.flash('correcto', 'Se ha enviado un email a su correo', result[0].email);
    res.redirect('/authentication/signin');
  }else{
    req.flash('message', 'El usuario no existe');
    res.redirect('/authentication/signup')

  }
    
});

router.get('/resetpass/:id/:token', helpers.validateToken, (req, res, next) => {

  console.log(res.locals.usario);
  res.send("FORMULARIO RESET PASSWORD");
  /*res.json({
    text: 'protegido'
  });*/

});

module.exports = router;