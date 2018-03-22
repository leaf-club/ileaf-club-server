var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var likeCommentSchema = new Schema({
    "userId":{type:Number, ref:"User"},
    "commentId":{type:Number, ref:"Blog"},
    // "workId":{type:Number, ref:"Work"},
    //"type":Number,
    "createTime":Number,
    "extra":String,
});


likeCommentSchema.plugin(autoIncrement.plugin, 'LikeComment');

module.exports = mongoose.model('LikeComment',likeCommentSchema);