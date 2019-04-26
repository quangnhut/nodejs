var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Category = new Schema({
    name: String,
    nameKhongDau: String,
}, { collection: 'category' });

module.exports = mongoose.model('Category', Category, 'category');