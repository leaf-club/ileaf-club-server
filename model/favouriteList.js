var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var favouriteListSchema = new Schema({
    "userId":{type:Number, ref:"User"},
    "blogId":{type:Number, ref:"Blog"},
    "workId":{type:Number, ref:"Work"},
    "type":Number,
    "createTime":Number,
    "extra":String,
});

favouriteListSchema.statics = {
    findFavouriteBlogs: function(userId,callback){
        return this
            .find({userId:userId,type:0})
            .sort({createTime:-1})
            .populate({path:"blogId",populate:{path:"userInfo",select:'userName avatar contact _id'}})
            .exec(callback)
            },
    findFavouriteWorks: function(userId,callback){
        return this
            .find({userId:userId,type:1})
            .sort({createTime:-1})
            .populate({path:"workId",populate:{path:"userInfo",select:'userName avatar contact _id'}})
            .exec(callback)
            },
    findFavouriteList: function(userId,callback){
        return this
            .find({userId:userId})
            .populate({path:"blogId",populate:{path:"userInfo",select:'userName avatar contact _id'}})
            .populate({path:"workId",populate:{path:"userInfo",select:'userName avatar contact _id'}})
            .exec(callback)
    }
}

favouriteListSchema.plugin(autoIncrement.plugin, 'FavouriteList');

module.exports = mongoose.model('FavouriteList',favouriteListSchema);