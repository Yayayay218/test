var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var quizSchema = new mongoose.Schema({
    title: String,
    featuredImg: String,
    description: String,
    result: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

quizSchema.plugin(mongoosePaginate);
mongoose.model('Quizzes', quizSchema);