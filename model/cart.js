var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Cart = new Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    cart: Object,
    status: Number,
}, {collection : 'cart'});
module.exports = mongoose.model('Cart', Cart);