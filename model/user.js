var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var userSchema = new Schema({
    "userName":String,
    "userPassword":String,
    "userRegisteredTime":String,
    "userImg":String,
    "userPhone":String,
    "userGender":Number,
    "userStatus":Number,
    "userNickname":String,
    "userAddress":String,
    "userFavouritesCount":{type:Number,default:0},
    "userPraiseCount":{type:Number,default:0},
    "favouriteBlogList":[{type:Number,ref:'FavouriteBlogList'}],
    "favouriteWorkList":[{type:Number,ref:'FavouriteWorkList'}],
    "praiseBlogList":[{type:Number,ref:'PraiseBlogList'}],
    "praiseWorkList":[{type:Number,ref:'PraiseWorkList'}],
    "userIp":String,
    "extra":String,
});

userSchema.statics = {
    findEverythings: function(userId,callback){
        return this
            .find({_id:userId})
            .populate('favouriteBlogList')
            .populate('favouriteWorkList')
            .populate('praiseBlogList')
            .populate('praiseWorkList')
            .exec(callback)
    }
}



userSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User',userSchema);