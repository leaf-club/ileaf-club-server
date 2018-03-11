var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var BlogCommentList = require('./blogCommentList');
var blogCommentListSchema = BlogCommentList.schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var blogSchema = new Schema({
            "userInfo":{type:Number, ref:'User'},
            "blogCreateTime":Number,
            "blogTitle":String,
            "blogAbstract":String,
            "blogContent":String,
            "blogSource":String,
            "blogFileUrl":String,
            "blogTypeName":String,
            "blogTypeId":Number,
            "blogStatus":Number,
            "liked":{type:Boolean,default:false},
            "praised":{type:Boolean,default:false},
            "blogCommentCount":Number,
            "blogPraiseCount":Number,
            "blogFavoritesCount":Number,
            "blogReadCount":Number,
            "blogUpdateTime":String,
            "extra":String,
        });

blogSchema.statics = {
    findBlogs: function(count,callback){
        return this
            .find({blogStatus:1})
            .limit(count)
            .sort({blogCreateTime:1})
            .populate({path:'userInfo',select:'userName userImg _id'})
            .exec(callback)
        },
    findBlogDetail:function(id,callback){
        return this
        .find({_id:id})
        .populate({path:'userInfo',select:'userName userImg _id'})
        .exec(callback)
    }
}

blogSchema.plugin(autoIncrement.plugin, 'Blog');

module.exports = mongoose.model('Blog',blogSchema);