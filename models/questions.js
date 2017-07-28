var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var questionSchema = new mongoose.Schema({
    title: String,
    featuredImg: String,
    type: Number,
    answers: [String],
    result: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date,
    quiz: {type: Schema.Types.ObjectId, ref: 'Quizzes'}
});

questionSchema.plugin(mongoosePaginate);
mongoose.model('Questions', questionSchema);