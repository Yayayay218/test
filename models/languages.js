var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var languageSchema = new mongoose.Schema({
    name: String,
});

languageSchema.plugin(mongoosePaginate);
mongoose.model('Languages', languageSchema);