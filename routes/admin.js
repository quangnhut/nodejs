var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var User = require('../model/user');
var Cart = require('../model/cart');

//home page admin
router.get('/',checkAdmin, function (req, res, next) {
    Cart.find().then(function(data){
        res.render('admin/main/index', {data : data});
    });
    console.log('Vào dashboard');
});

router.get('/login', function (req, res, next) {
    res.render('admin/login/index');
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true,
    }));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Username không đúng' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Password không đúng' });
        }
        return done(null, user);
    });
}));
passport.serializeUser((email, done) => {
    done(null, email.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, email) => {
        done(err, email);
    });
});


router.post('/getUser', checkAdmin, function (req, res) {
    console.log(req.user);
    res.json(req.user);
});

router.get('/logout.html',checkAdmin, function (req, res) {
    req.logout();
    res.redirect('/admin/login');
});

function checkAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        console.log('Bạn phải đăng nhập để vào');
        console.log(req.isAuthenticated());
        res.redirect('/admin/login');
    }
}


module.exports = router;