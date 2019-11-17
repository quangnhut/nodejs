var express = require('express');
var router = express.Router();
var User = require('../model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('get user');
});

/* GET home page. */
router.get('/', checkAdmin, function (req, res, next) {
  res.redirect('admin/user/danh-sach.html');
});

router.get('/danh-sach.html', function (req, res, next) {
  User.find().then(function (data) {
    res.render('admin/user/danhsach', { data: data });
  });
});

router.get('/them-user.html', function (req, res, next) {
  res.render('admin/user/them', { errors: null });
});

router.post('/them-user.html', function (req, res, next) {
  req.checkBody('username', 'Tên không được để trống').notEmpty();
  req.checkBody('username', 'Độ dài quá dài').isLength({ max: 32 });
  req.checkBody('email', 'Email không được để trống').notEmpty();
  req.checkBody('password', 'Mật khẩu không được để trống').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('admin/user/them', { errors: errors });
  }
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  user.save().then(function () {
    req.flash('success_msg', 'Thêm thành công');
    res.redirect('/admin/user/danh-sach.html');
  });
});

router.get('/:id/xoa-user.html', function (req, res, next) {
  User.findById(req.params.id).remove(function () {
    req.flash('success_msg', 'Xóa thành công');
    res.redirect('/admin/user/danh-sach.html');
  });
});

router.get('/:id/sua-user.html', function (req, res, next) {
  User.findById(req.params.id, function (err, data) {
    res.render('admin/user/sua', { errors: null, data: data });
  })
});

router.post('/:id/sua-user.html', function (req, res, next) {
  req.checkBody('username', 'Tên không được rỗng').notEmpty();
  req.checkBody('username', 'Lenght').isLength({ max: 32 });
  req.checkBody('email', 'Email không được rỗng').notEmpty();
  req.checkBody('password', 'Mật khẩu không được rỗng').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    //Bắt lỗi validate chạy vào đây
    Console.log(errors);
  } else {
    User.findById(req.params.id, function (err, data) {
      data.username = req.body.username;
      data.email = req.body.email;
      data.password = req.body.password;
      data.save().then(() => {
        req.flash('success_msg', 'Đã sửa thành công');
        res.redirect('/admin/user/danh-sach.html');
      });
    });
  }
});

function checkAdmin(req, res, next) {

  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/admin/dang-nhap.html');
  }
}

module.exports = router;