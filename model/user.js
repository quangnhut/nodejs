var  mongoose = require('mongoose');

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var User = new Schema({
    username: String,
    password: String,
    email : String,
    image: String,
}, {collection: 'user'});

User.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

module.exports = mongoose.model('User', User);