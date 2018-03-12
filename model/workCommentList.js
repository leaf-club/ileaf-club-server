var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var workCommentListSchema = new Schema({ 
    "workId":Number,
    "userInfo":{type: Number, ref: 'User'},
    "repliedUserInfo":{type: Number, ref: 'User'},
    "createTime":Number,
    "likeNum":{type:Number,default:0},
    "content":String,
    "status":Number,//如果是1，则是评论，如果是2，则是评论的回复
    "replyList":[{
        type: Number,
        ref: 'WorkCommentReplyList',
    }],
    "extra":String,
});

workCommentListSchema.statics = {
    findUserByCommentId: function(workId,callback){
        return this
            .find({workId:workId})
            .populate({path:'userInfo',select:'userName avatar contact _id'})
            .populate({path:'repliedUserInfo',select:'userName avatar contact _id'})
            .populate({path:'replyList', populate:{path:'replyUserInfo',select:'userName avatar contact _id'}})
            .populate({path:'replyList', populate:{path:'repliedUserInfo',select:'userName avatar contact _id'}})
            .exec(callback)
    }
}

workCommentListSchema.plugin(autoIncrement.plugin, 'WorkCommentList');

module.exports = mongoose.model('WorkCommentList',workCommentListSchema);