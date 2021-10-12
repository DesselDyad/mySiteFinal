//require various ressources
//express itself
var express = require('express');
//path to set static directory
var path = require('path');
//cookie and body parsers
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//session, passport, validation & user feedback
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
//mongo
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

//Set up MongoDB database stuff
require('./assets/config/passport');
mongoose.connect(require('./assets/config/config').url, { useNewUrlParser: true });
var db = mongoose.connection;

// Init App
var app = express();

// View Engine
// app.set('views', path.join(__dirname, 'views'));
app.set('views', __dirname + '/assets/views');
app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: db,
    ttl: 60 * 60,
    autoRemove: 'interval',
    autoRemoveInterval: 60 // In minutes. Default
  })
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator - i'm not sure what this actually does, but the validator needs it to run
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  //flash errors
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.errors = req.errors || null;
  res.locals.user_err = req.user_err || null;
  res.locals.mail = req.mail || null;
  res.locals.phone_number = req.mail || null;
  //req.user
  res.locals.user = req.user || null;
  //product page
  next();
});

require('./assets/routes/public_index')(app);
// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server started on http://localhost:' + app.get('port'));
});