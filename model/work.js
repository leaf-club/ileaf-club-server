var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var workSchema = new Schema({
            "userInfo":{type:Number,ref:'User'},
            "workCreateTime":Number,
            "workTiltle":String,
            "workFileUrl":String,
            "workTypeName":String,
            "workTypeId":Number,
            "workDescription":String,
            "liked":{type:Boolean,default:false},
            "praised":{type:Boolean,default:false},
            "workCommentCount":Number,
            "workPraiseCount":Number,
            "workFavoriteCount":Number,
            "workReadCount":Number,
            "workUpdateTime":Number,
            "extra":String,
        });

workSchema.statics = {
    findWorks: function(count,callback){
        return this
            .find()
            .limit(count)
            .sort({blogCreateTime:1})
            .populate({path:'userInfo',select:'userName userImg _id'})
            .exec(callback)
            },
    findWorkDetail:function(id,callback){
        return this
            .find({_id:id})
            .populate({path:'userInfo',select:'userName userImg _id'})
            .exec(callback)
        }
}

workSchema.plugin(autoIncrement.plugin, 'Work');

module.exports = mongoose.model('Work',workSchema);