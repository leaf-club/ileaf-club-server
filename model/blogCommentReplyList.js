var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);


var blogCommentReplyListSchema = new Schema({
            "replyUserInfo":{type: Number, ref: 'User'},
            "repliedUserInfo":{type: Number, ref: 'User'},
            "replyContent":String,
            "createTime":Number,
            "extra":String,
});

blogCommentReplyListSchema.plugin(autoIncrement.plugin, 'BlogCommentReplyList');

module.exports = mongoose.model('BlogCommentReplyList',blogCommentReplyListSchema);