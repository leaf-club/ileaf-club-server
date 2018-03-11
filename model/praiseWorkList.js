var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/leafclub");
autoIncrement.initialize(connection);

var praiseWorkListSchema = new Schema({
    "userId":Number,
    "workId":Number,
    "extra":String,
});


praiseWorkListSchema.plugin(autoIncrement.plugin, 'PraiseWorkList');

module.exports = mongoose.model('PraiseWorkList',praiseWorkListSchema);