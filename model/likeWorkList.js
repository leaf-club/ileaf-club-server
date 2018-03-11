var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var likeWorkListSchema = new Schema({
    "userId":Number,
    "workId":Number,
    "createTime":Number,
    "extra":String,
});


likeWorkListSchema.plugin(autoIncrement.plugin, 'LikeWorkList');

module.exports = mongoose.model('LikeWorkList',likeWorkListSchema);