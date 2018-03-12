var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var favouriteListSchema = new Schema({
    "userId":Number,
    "blogOrWorkId":Number,
    "type":Number,
    "createTime":Number,
    "extra":String,
});

favouriteBlogListSchema.plugin(autoIncrement.plugin, 'FavouriteList');

module.exports = mongoose.model('FavouriteList',favouriteListSchema);