var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var userSchema = new Schema({
    "userName":String,
    "password":String,
    "registeredTime":String,
    "avatar":String,
    "contact":String,
    "gender":Number,
    "status":Number,
    "address":String,
    "favoriteNum":{type:Number,default:0},
    "likeNum":{type:Number,default:0},
    "userIp":String,
    "extra":String,
});

userSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User',userSchema);