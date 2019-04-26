var express = require("express");
var router = express.Router();
var Cart = require('../model/cart');

router.get('/', checkAdmin, function (req, res, next) {
    res.redirect('/admin/cart/danh-sach.html');
});
router.get('/danh-sach.html', checkAdmin, function (req, res, next) {
    Cart.find().then(function (data) {
        console.log(data);
        res.render('admin/cart/danhsach', {data: data});
    });
});
router.get('/:id/cart-detail.html', function (req, res, next) {
    var id = req.params.id;
    Cart.findById(id).then(function (data) {
        res.render('admin/cart/view', { cart: data });
    });
});

router.get('/:id/checkout.html', checkAdmin, function (req, res, next) {
    var id = req.params.id;
    Cart.findById(id, function (err, data) {
        data.status = 1;
        data.save();
        req.flash('success_msg', "Đã thanh toán");
        res.redirect('/admin/cart/danh-sach.html');
        // res.redirect('/admin/cart/' + id + '/checkout.html');
    });
});

router.get('/:id/delete-cart.html', checkAdmin, function (req, res, next) {
    var id = req.params.id;
    Cart.findOneAndRemove({ _id: id }, function (err, offer) {
        req.flash('success_msg', 'Xóa thành công');
        res.redirect('/admin/cart/danh-sach.html');
    });
});
router.get('/', function(req, res){
    Cart.find().then(function(data){
        console.log("Số lượng = "+data.length);
    })
});

function checkAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/admin/login.html');
    }
}
module.exports = router;