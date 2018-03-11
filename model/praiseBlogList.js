var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var praiseBlogListSchema = new Schema({
    "userId":Number,
    "blogId":Number,
    "extra":String,
});

praiseBlogListSchema.plugin(autoIncrement.plugin, 'PraiseBlogList');

module.exports = mongoose.model('PraiseBlogList',praiseBlogListSchema);