var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Product = new Schema({
    name: String,  
    nameKhongDau: String,
    image: String,
    description: String,
    categoryID: String,
    price: Number
}, {collection : 'product'});

module.exports = mongoose.model('Product', Product);