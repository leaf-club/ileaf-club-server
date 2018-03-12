var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var workSchema = new Schema({
            "userInfo":{type:Number,ref:'User'},
            "createTime":{type:Number,default:Date.now()},
            "title":String,
            "url":String,
            "typeName":String,
            "typeId":Number,
            "description":String,
            "cover":String,
            "liked":{type:Boolean,default:false},
            "favorited":{type:Boolean,default:false},
            "commentNum":{type:Number,default:0},
            "likeNum":{type:Number,default:0},
            "favoriteNum":{type:Number,default:0},
            "readNum":{type:Number,default:0},
            "updateTime":{type:Number,default:Date.now()},
            "extra":String,
        });

workSchema.statics = {
    findWorkList: function(skip,pageSize,callback){
        return this
            .find()
            .skip(skip)
            .limit(pageSize)
            .sort({createTime:-1})
            .populate({path:'userInfo',select:'userName avatar contact _id'})
            .exec(callback)
            },
    findWorks: function(count,callback){
        return this
            .find()
            .limit(count)
            .sort({createTime:-1})
            .populate({path:'userInfo',select:'userName avatar contact _id'})
            .exec(callback)
            },
    findWorkDetail:function(id,callback){
        return this
            .findOne({_id:id})
            .populate({path:'userInfo',select:'userName avatar contact _id'})
            .exec(callback)
        }
}

workSchema.plugin(autoIncrement.plugin, 'Work');

module.exports = mongoose.model('Work',workSchema);