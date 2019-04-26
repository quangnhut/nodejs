var express = require('express');
var router = express.Router();

var Category = require('../model/category');
var Product = require('../model/product');
var Cart = require('../model/cart');
var GioHang = require('../model/giohang');

var countJson = function(json){
	var count = 0;
	for(var id in json){
			count++;
	}

	return count;
}


/* GET home page. */
router.get('/', function(req, res, next) {
  var gioHang = new GioHang((req.session.cart) ? req.session.cart : {items: {}});
  var data = gioHang.convertArray();
  // console.log("indexlog sl: " + data.length);
  // data.forEach(function(da){
  //   console.log("da sl : "+ da.soLuong);
  // });
  Product.find().then(function(product){
    Category.find().then(function (category) {
      res.render('client/page/index', { product: product, category: category, data: data });
    });
  });
  //res.render('client/page/index');
});

router.get('/category/:name.:id.html', function(req, res){
  Product.find({ categoryID: req.params.id }).then(function (data) {
    Category.find().then(function(category){
      console.log("data  " + data);
      console.log("cate" + category);
      res.render('client/page/category', { product: data, category: category });
    });
  });
});

router.get('/chi-tiet/:name.:id.:category.html', function(req, res){
  Product.findById(req.params.id).then(function(data){
    Product.find({categoryID: data.categoryID, _id: {$ne: data._id}}).limit(3).then(function(product){
      res.render('client/page/chitiet', {data: data, product: product});
    });
  });
});

router.post('/menu', function(req, res){
  Category.find().then(function(data){
    res.json(data);
  });
});

router.get('/dat-hang.html', function(req, res){
  var gioHang = new GioHang(req.session.cart ? req.session.cart : {items: {}});
  if(req.session.cart){
    if(countJson(req.session.cart.items) > 0){
      res.render('client/page/check', {errors: null});
    }else{
      res.redirect('/');
    }
  }else{
    res.redirect('/');
  }
});

router.post('/dat-hang.html', function(req, res){
  var gioHang = new GioHang((req.session.cart) ? req.session.cart : { items: {} });
  var data = gioHang.convertArray();
  var cart = new Cart({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    cart : data,
    status: 0
  });
  cart.save().then(function(){
    req.session.cart = {items: {}};
    res.redirect('/');
  });

});


router.get('/add-cart.:id', function(req, res){
  var id = req.params.id;
  var gioHang = new GioHang((req.session.cart) ? req.session.cart : {items: {}});
  Product.findById(id).then(function(data){
    gioHang.add(id, data);
    req.session.cart = gioHang;
    res.redirect('/gio-hang.html');
  });
});

router.get('/gio-hang.html', function(req, res){
  var gioHang = new GioHang((req.session.cart) ? req.session.cart : {items: {}});
  var data = gioHang.convertArray();
  console.log(data);
  res.render('client/page/cart', {data: data});
});

router.post('/updateCart', function(req,res){
  var id = req.body.id;
  var soLuong = req.body.soLuong;
  var gioHang = new GioHang((req.session.cart) ? req.session.cart : {items: {}});
  gioHang.updateCart(id, soLuong);
  req.session.cart = gioHang;
  res.json({status : 1});
});
router.post('/deleteCart', function(req, res){
  var id = req.body.id;
  var gioHang = new GioHang((req.session.cart) ? req.session.cart : {items: {}});
  gioHang.deleteCart(id);
  console.log("id = "+id);
  req.session.cart = gioHang;
  res.json({status: 1});
});

module.exports = router;