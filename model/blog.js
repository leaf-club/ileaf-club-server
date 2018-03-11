var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var blogSchema = new Schema({
            "userInfo":{type:Number, ref:'User'},
            "createTime":Number,
            "title":String,
            "abstract":String,
            "htmlCode":String,
            "mdCode":String,
            "typeName":String,
            "typeId":Number,
            "tag":String,
            "status":Number,
            "liked":{type:Boolean,default:false},
            "favorited":{type:Boolean,default:false},
            "commentNum":{type:Number,default:0},
            "likeNum":{type:Number,default:0},
            "favoritesNum":{type:Number,default:0},
            "readNum":{type:Number,default:0},
            "updateTime":Number,
            "extra":String,
        });

blogSchema.statics = {
    findBlogs: function(count,callback){
        return this
            .find({status:1})
            .limit(count)
            .sort({createTime:-1})
            .populate({path:'userInfo',select:'userName avatar _id'})
            .exec(callback)
        },
    findBlogDetail:function(id,callback){
        return this
        .find({_id:id})
        .populate({path:'userInfo',select:'userName avatar _id'})
        .exec(callback)
    }
}

blogSchema.plugin(autoIncrement.plugin, 'Blog');

module.exports = mongoose.model('Blog',blogSchema);