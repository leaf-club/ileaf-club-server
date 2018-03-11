var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var blogCommentListSchema = new Schema({ 
    "blogId":Number,
    "commentUserInfo":{type: Number, ref: 'User'},
    "repliedUserInfo":{type: Number, ref: 'User'},
    "createTime":Number,
    "blogCommentPraiseCount":Number,
    "blogCommentContent":String,
    "commentStatus":Number,//如果是1，则是评论，如果是2，则是评论的回复
    "blogCommentReplyList":[{
        type: Number,
        ref: 'BlogCommentReplyList',
    }],
    "extra":String,
});

blogCommentListSchema.statics = {
    findUserByCommentId: function(blogId,callback){
        return this
            .find({blogId:blogId})
            .populate({path:'commentUserInfo',select:'userName userImg _id'})
            .populate({path:'repliedUserInfo',select:'userName userImg _id'})
            .populate({path:'blogCommentReplyList', populate:{path:'replyUserInfo',select:'userName userImg _id'}})
            .populate({path:'blogCommentReplyList', populate:{path:'commentRepliedUserInfo',select:'userName userImg _id'}})
            .exec(callback)
    }
}

blogCommentListSchema.plugin(autoIncrement.plugin, 'BlogCommentList');

module.exports = mongoose.model('BlogCommentList',blogCommentListSchema);

