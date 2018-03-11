var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var favouriteBlogListSchema = new Schema({
    "userId":Number,
    "blogId":Number,
    "extra":String,
});

favouriteBlogListSchema.plugin(autoIncrement.plugin, 'FavouriteBlogList');

module.exports = mongoose.model('FavouriteBlogList',favouriteBlogListSchema);