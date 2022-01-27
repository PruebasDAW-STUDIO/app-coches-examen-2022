const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signin', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  

  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  console.log(rows);
  //console.log(req.body);
  //console.log(username);
  //console.log(password);
  if(rows.length > 0){
    const user = rows[0];
    const validPassport = await helpers.matchPassword(password, user.password);

    if(validPassport){

      done(null, user, req.flash('correcto', 'Bienvenido ' + user.username));

    }else{

      done(null, false, req.flash('message', 'Contraseña incorecta'));

    }

  } else {

    return done(null, false, req.flash('message','El usuario NO existe'));

  }

  
  
}));



passport.use('local.signup', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  
  const { fullname, email } = req.body;

  const newUser = {
      username,
      password,
      fullname, 
      email
  };
  newUser.password = await helpers.encryptPassword(password);
  const resultado = await pool.query('INSERT INTO users SET ?', [newUser]);
  console.log(resultado);

  newUser.id = resultado.insertId;
  return done(null, newUser); 
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);

});








