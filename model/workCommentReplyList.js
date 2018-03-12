var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);


var workCommentReplyListSchema = new Schema({
            "replyUserInfo":{type: Number, ref: 'User'},
            "repliedUserInfo":{type: Number, ref: 'User'},
            "content":String,
            "createTime":Number,
            "extra":String,
});

workCommentReplyListSchema.plugin(autoIncrement.plugin, 'WorkCommentReplyList');

module.exports = mongoose.model('WorkCommentReplyList',workCommentReplyListSchema);