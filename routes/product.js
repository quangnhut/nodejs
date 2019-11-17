var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
var upload = multer({ storage: storage });
var fs = require('fs');

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
var Category = require('../model/category');
var Product = require('../model/product');

router.get('/',checkAdmin, function(req, res){
    res.redirect('/admin/product/danh-sach.html');
});

router.get('/danh-sach.html', checkAdmin,function(req, res){
    Product.find().then(function(product){
        res.render('admin/product/danhsach', {errors: null, product: product});
    });
});

router.get('/them-product.html', checkAdmin,function(req, res){
    Category.find().then(function(category){
        res.render('admin/product/them', {errors: null, category: category});
    });
});

router.post('/them-product.html', upload.single('image'), function(req, res){
    req.checkBody('name', 'Tên không được rỗng').notEmpty();
    req.checkBody('price', 'Kiểu số').isInt();
    req.checkBody('description', 'Mô tả không được trống').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var file = './public/upload/' + req.file.filename;
       fs.unlink(file, function(err){
           if(err) throw err;
       });
       Category.find().then(function(category){
        res.render('admin/product/them', {errors: errors, category: category});
       });
    }else{
        var product = new Product({
            name: req.body.name,  
            nameKhongDau: bodauTiengViet(req.body.name),
            image: req.file.filename,
            description: req.body.description,
            categoryID: req.body.category,
            price: req.body.price
        });
        product.save().then(function(){
            req.flash('success_msg', 'Thêm sản phẩm thành công');
            res.redirect('/admin/product/danh-sach.html');
        });
    }
});

router.get('/:id/sua-product.html', checkAdmin,function(req, res){
   Product.findById(req.params.id).then(function(data){
       Category.find().then(function(category){
           res.render('admin/product/sua', {errors: null, category: category, product: data});
       });
   });
});

router.post('/:id/sua-product.html',upload.single('image'), function(req, res){
    req.checkBody('name', 'Tên không được rỗng').notEmpty();
    req.checkBody('price', 'Kiểu số').isInt();
    req.checkBody('description', 'Mô tả không được trống').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var file = './public/upload/' + req.file.filename;
       fs.unlink(file, function(err){
           if(err) throw err;
       });  
       Product.findById(req.params.id).then(function(data){
        Category.find().then(function(category){
            res.render('admin/procduct/sua', {error: errors, category: category, product: data});
        });
       });
    }else{
        Product.findOne({_id: req.params.id}, function(err, data){
            var file = './public/upload/' + data.filename;
            // fs.unlink(file, function(err){
            //     if(err) throw err;
            // });
            data.name = req.body.name;
            data.nameKhongDau= bodauTiengViet(req.body.name);
            //data.image= req.file.filename;
            data.description= req.body.description;
            data.categoryID= req.body.category;
            data.price= req.body.price;
            data.save();
            req.flash('success_msg', 'Sửa thành công');
            res.redirect('/admin/product/danh-sach.html');
            // res.redirect('admin/product/'+req.params.id+'/sua-product.html');
        });
    }
});

router.get('/:id/xoa-product.html',checkAdmin, function(req, res){
   Product.findById(req.params.id, function(error, data){
       var file = './public/upload/' + data.image;
       fs.unlink(file, function(err){
           if(err) throw err;
       });
       data.remove(function(){
           req.flash('success_msg', 'Xóa sản phẩm thành công');
           res.redirect('/admin/product/danh-sach.html');
       });
   });
});

function checkAdmin(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/admin/login')
    }
}

module.exports = router;