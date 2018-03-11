var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var workCommentListSchema = new Schema({ 
    "workId":Number,
    "commentUserInfo":{type: Number, ref: 'User'},
    "repliedUserInfo":{type: Number, ref: 'User'},
    "createTime":Number,
    "workCommentPraiseCount":Number,
    "workCommentContent":String,
    "commentStatus":Number,//如果是1，则是评论，如果是2，则是评论的回复
    "workCommentReplyList":[{
        type: Number,
        ref: 'WorkCommentReplyList',
    }],
    "extra":String,
});

workCommentListSchema.statics = {
    findUserByCommentId: function(workId,callback){
        return this
            .find({workId:workId})
            .populate({path:'commentUserInfo',select:'userName userImg _id'})
            .populate({path:'repliedUserInfo',select:'userName userImg _id'})
            .populate({path:'workCommentReplyList', populate:{path:'replyUserInfo',select:'userName userImg _id'}})
            .populate({path:'workCommentReplyList', populate:{path:'commentRepliedUserInfo',select:'userName userImg _id'}})
            .exec(callback)
    }
}

workCommentListSchema.plugin(autoIncrement.plugin, 'WorkCommentList');

module.exports = mongoose.model('WorkCommentList',workCommentListSchema);