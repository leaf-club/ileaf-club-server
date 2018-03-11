var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var likeBlogListSchema = new Schema({
    "userId":Number,
    "blogId":Number,
    "createTime":Number,
    "extra":String,
});

likeBlogListSchema.plugin(autoIncrement.plugin, 'LikeBlogList');

module.exports = mongoose.model('LikeBlogList',likeBlogListSchema);