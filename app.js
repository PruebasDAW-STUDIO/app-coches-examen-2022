var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const {engine} = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const smysql = require('express-mysql-session'); 
const { database_dev, database_prod } = require('./keys');
const passport = require('passport');
const favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var authenticationRouter = require('./routes/authentication');
var linksRouter = require('./routes/links');

var database;

var app = express();
require('./lib/passport');

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({

  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')

}));

app.set('view engine', '.hbs');

if(process.env.NODE_ENV === 'produccion'){
  database = database_prod
}else{
  database = database_dev
}


app.use(session({
  secret: 'patata',
  resave: false,
  saveUninitialized: false,
  store: new smysql(database)
}));

app.use(flash());



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.correcto = req.flash('correcto');  
  app.locals.user = req.user;
  next();
})


app.use(express.static(path.join(__dirname, 'public')));








app.use('/', indexRouter);

app.use('/authentication', authenticationRouter);
app.use('/links', linksRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
