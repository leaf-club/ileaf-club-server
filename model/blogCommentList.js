var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var blogCommentListSchema = new Schema({ 
    "blogId":Number,
    "userInfo":{type: Number, ref: 'User'},
    "repliedUserInfo":{type: Number, ref: 'User'},
    "createTime":Number,
    "likeNum":{type:Number,default:0},
    "content":String,
    "liked":false,
    "status":Number,//如果是1，则是评论，如果是2，则是评论的回复
    "replyList":[{
        type: Number,
        ref: 'BlogCommentReplyList',
    }],
    "extra":String,
});

blogCommentListSchema.statics = {
    findCommentByBlogId: function(blogId,callback){
        return this
            .find({blogId:blogId})
            .populate({path:'userInfo',select:'userName avatar contact _id'})
            .populate({path:'repliedUserInfo',select:'userName avatar contact _id'})
            .populate({path:'replyList', populate:{path:'replyUserInfo',select:'userName avatar contact _id'}})
            .populate({path:'replyList', populate:{path:'repliedUserInfo',select:'userName avatar contact _id'}})
            .exec(callback)
    }
}

blogCommentListSchema.plugin(autoIncrement.plugin, 'BlogCommentList');

module.exports = mongoose.model('BlogCommentList',blogCommentListSchema);

