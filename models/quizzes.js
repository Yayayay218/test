var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var resultSchema = new mongoose.Schema({
    title: String,
    featuredImg: String,
    correctNumber: {
        type: Number,
        default: 0
    }
})

var questionSchema = new mongoose.Schema({
    title: String,
    featuredImg: String,
    answers: [{
        title: String,
        isCorrect: {
            type: Number,
            default: 0
        }
    }]
})

var quizSchema = new mongoose.Schema({
    title: String,
    featuredImg: String,
    description: String,
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date,
    results: [resultSchema],
    questions: [questionSchema]
});

quizSchema.plugin(mongoosePaginate);
mongoose.model('Quizzes', quizSchema);