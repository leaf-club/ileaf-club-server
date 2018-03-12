var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var likeListSchema = new Schema({
    "userId":Number,
    "blogId":Number,
    "type":Number,
    "createTime":Number,
    "extra":String,
});

likeListSchema.plugin(autoIncrement.plugin, 'LikeList');

module.exports = mongoose.model('LikeList',likeListSchema);