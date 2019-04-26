var express = require('express');
var router = express.Router();
var Category = require('../model/category');

function bodauTiengViet(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/ /g, "-");
  str = str.replace(/\./g, "-");
  return str;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('admin/category/danh-sach.html');
});
router.get('/danh-sach.html', function(req, res, next){
  Category.find().then(function(data){
    res.render('admin/category/danhsach', {data: data});
  });
});

router.get('/them-category.html', function(req, res, next){
  res.render('admin/category/them', {errors: null}) ;
});

router.post('/them-category.html', function(req, res, next){
  req.checkBody('name', 'Không được để trống').notEmpty();
  req.checkBody('name', 'Độ dài quá dài').isLength({min:3, max:32});
  var errors = req.validationErrors();
  if(errors){
    res.render('admin/category/them', { errors: errors });
  }
  var category  = new Category({
    name : req.body.name,
    nameKhongDau : bodauTiengViet(req.body.name)
  });
  category.save().then(function(){
    req.flash('success_msg', 'Thêm thành công');
    res.redirect('/admin/category/danh-sach.html');
  });
});

router.get('/:id/sua-category.html', function(req, res, next){
  Category.findById(req.params.id, function(err, data){
    res.render('admin/category/sua', {errors: null, data: data});
  })
});

router.post('/:id/sua-category.html', function(req, res, next){
  req.checkBody('name', 'Giá trị không được rỗng');
  req.checkBody('name', 'Lenght').isLength({min: 3, max:32});
  var errors = req.validationErrors();
  if(errors){
    Category.findById(req.params.id, function(err, data){
      data.name = req.body.name;
      data.nameKhongDau = bodauTiengViet(req.body.name);
      data.save().then(function(){
        req.flash('success_msg', 'Đã sữa thành công');
        res.redirect('admin/category'+req.params.id+'/sua-category.html');
      });
    
    });
  }
});

router.get('/:id/xoa-category.html', function(req, res, next){
  Category.findById(req.params.id).remove(function(){
    req.flash('success_msg', 'Xóa thành công');
    res.redirect('/admin/category/danh-sach.html');
  });
});

function checkAdmin(req, res, next){
   
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect('/admin/dang-nhap.html');
  }
}
module.exports = router;