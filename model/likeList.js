var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var likeListSchema = new Schema({
    "userId":{type:Number, ref:"User"},
    "blogId":{type:Number, ref:"Blog"},
    "workId":{type:Number, ref:"Work"},
    "type":Number,
    "createTime":Number,
    "extra":String,
});

likeListSchema.statics = {
    findLikeBlogs: function(userId,callback){
        return this
            .find({userId:userId,type:0})
            .sort({createTime:-1})
            .populate({path:"blogId",populate:{path:"userInfo",select:'userName avatar contact _id'}})
            .exec(callback)
            },
    findLikeWorks: function(userId,callback){
        return this
            .find({userId:userId,type:1})
            .sort({createTime:-1})
            .populate({path:"workId",populate:{path:"userInfo",select:'userName avatar contact _id'}})
            .exec(callback)
            }
}

likeListSchema.plugin(autoIncrement.plugin, 'LikeList');

module.exports = mongoose.model('LikeList',likeListSchema);