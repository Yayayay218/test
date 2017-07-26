var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var questionSchema = new mongoose.Schema({
    title: String,
    featureImg: String,
    type: Number,
    answers: [],
    result: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

questionSchema.plugin(mongoosePaginate);
mongoose.model('Questions', questionSchema);