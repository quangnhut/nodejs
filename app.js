var createError = require('http-errors');
var favicon = require('serve-favicon');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);
var mongodb = require('mongodb');
var flash = require('connect-flash');
var validator = require('express-validator');
var message = require('express-message');

//Config router
var index = require('./routes/index');
var admin = require('./routes/admin');
var user = require('./routes/users');
var category = require('./routes/category');
var product = require('./routes/product');
var cart = require('./routes/cart');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Connect to DB
var mongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/shop';
mongoose.connect(url, { useNewUrlParser: true }).then(
  () => {
    console.log("Kết nối database thành công");
  },
  err => {
    console.log("Loi ket noi DB");
  }
);

//handle session
app.use(session({
  secret: 'nhutjt',
  saveUninitialized: true,
  key: 'user',
  saveUninitialized: true,
  resave: true
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

//setup passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Validator
app.use(validator({
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


//Using router
app.use('/', index);
app.use('/admin', admin);
app.use('/admin/user', user);
app.use('/admin/category', category);
app.use('/admin/product', product);
app.use('/admin/cart', cart);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;